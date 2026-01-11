import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Payment } from './entities/payment.entity';
import { ProductItem } from '../inventory/entities/product-item.entity';
import { SaleStatus, PaymentStatus, PaymentMethod } from './sales.constants';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private salesRepo: Repository<Sale>,
        @InjectRepository(SaleItem)
        private saleItemsRepo: Repository<SaleItem>,
        @InjectRepository(Payment)
        private paymentsRepo: Repository<Payment>,
        @InjectRepository(ProductItem)
        private productItemsRepo: Repository<ProductItem>,
        private dataSource: DataSource,
    ) { }

    async findAll(query: any) {
        const { page = 1, limit = 10 } = query;
        const [data, total] = await this.salesRepo.findAndCount({
            relations: ['customer', 'staff'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            data,
            total,
            page: +page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        const sale = await this.salesRepo.findOne({
            where: { id },
            relations: ['customer', 'staff', 'items', 'items.item', 'payments', 'payments.receiver'],
        });
        if (!sale) throw new NotFoundException('Sale not found');
        return sale;
    }

    async create(createDto: any) {
        const { code, customerId, staffId, items, initialPayment } = createDto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Create Sale Header
            const sale = this.salesRepo.create({
                code,
                customerId,
                staffId,
                status: SaleStatus.DRAFT,
            });
            const savedSale = await queryRunner.manager.save(sale);

            let totalAmount = 0;

            // 2. Process Items
            for (const itemDto of items) {
                const productItem = await queryRunner.manager.findOne(ProductItem, { where: { id: itemDto.itemId } });
                if (!productItem) throw new BadRequestException(`Item ${itemDto.itemId} not found`);

                // TODO: Check if item is already sold (sale_items unique constraint handles this at DB level)

                const saleItem = this.saleItemsRepo.create({
                    saleId: savedSale.id,
                    itemId: itemDto.itemId,
                    salePrice: itemDto.salePrice,
                });
                await queryRunner.manager.save(saleItem);

                totalAmount += +itemDto.salePrice;

                // Update item status to 'Sold' (assuming status ID 2 for Sold as per previous seed)
                productItem.statusId = 2;
                await queryRunner.manager.save(productItem);
            }

            savedSale.totalAmount = totalAmount;

            // 3. Process Initial Payment (if any)
            if (initialPayment) {
                const payment = this.paymentsRepo.create({
                    saleId: savedSale.id,
                    amount: initialPayment.amount,
                    paymentMethod: initialPayment.method,
                    receiverId: staffId,
                });
                await queryRunner.manager.save(payment);
                savedSale.paidAmount = initialPayment.amount;

                if (savedSale.paidAmount >= savedSale.totalAmount) {
                    savedSale.paymentStatus = PaymentStatus.PAID;
                } else if (savedSale.paidAmount > 0) {
                    savedSale.paymentStatus = PaymentStatus.PARTIAL;
                }
            }

            await queryRunner.manager.save(savedSale);
            await queryRunner.commitTransaction();

            return this.findOne(savedSale.id);
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async addPayment(saleId: number, paymentDto: any) {
        const sale = await this.findOne(saleId);

        const payment = this.paymentsRepo.create({
            saleId,
            amount: paymentDto.amount,
            paymentMethod: paymentDto.method,
            receiverId: paymentDto.receiverId,
            referenceNumber: paymentDto.referenceNumber,
            notes: paymentDto.notes,
        });

        await this.paymentsRepo.save(payment);

        // Update Sale totals
        sale.paidAmount = +sale.paidAmount + +paymentDto.amount;
        if (sale.paidAmount >= sale.totalAmount) {
            sale.paymentStatus = PaymentStatus.PAID;
        } else {
            sale.paymentStatus = PaymentStatus.PARTIAL;
        }

        await this.salesRepo.save(sale);
        return payment;
    }
}
