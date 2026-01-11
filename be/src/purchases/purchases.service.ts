import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectRepository(Purchase)
        private purchasesRepo: Repository<Purchase>,
        private dataSource: DataSource,
    ) { }

    async create(data: Partial<Purchase>): Promise<Purchase> {
        // Transactional creation of purchase and items
        // Simplified for now, can use queryRunner if strictly needed, but cascade: true on items handles it
        const purchase = this.purchasesRepo.create(data);
        return this.purchasesRepo.save(purchase);
    }

    async findAll(query: any): Promise<any> {
        const { page = 1, limit = 10 } = query;
        const take = limit;
        const skip = (page - 1) * take;

        const [results, total] = await this.purchasesRepo.findAndCount({
            order: { createdAt: 'DESC' },
            relations: ['customer', 'staff', 'status', 'items', 'items.item'],
            take,
            skip,
        });

        return {
            data: results,
            total,
            page: +page,
            lastPage: Math.ceil(total / take),
        };
    }

    async findOne(id: number): Promise<Purchase | null> {
        return this.purchasesRepo.findOne({
            where: { id },
            relations: ['customer', 'staff', 'status', 'items', 'items.item'],
        });
    }
}
