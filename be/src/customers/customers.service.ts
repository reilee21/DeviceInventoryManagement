import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) { }

    async create(createCustomerDto: Partial<Customer>): Promise<Customer> {
        const customer = this.customersRepository.create(createCustomerDto);
        return this.customersRepository.save(customer);
    }

    async findAll(query: any): Promise<any> {
        const { search, type, page = 1, limit = 10 } = query;
        const take = limit;
        const skip = (page - 1) * take;

        let where: any;
        if (search) {
            where = [
                { ...(type && { type }), name: ILike(`%${search}%`) },
                { ...(type && { type }), phone: ILike(`%${search}%`) },
            ];
        } else {
            where = {};
            if (type) {
                where.type = type;
            }
        }

        const [results, total] = await this.customersRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
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

    async findOne(id: number): Promise<Customer | null> {
        return this.customersRepository.findOne({ where: { id } });
    }

    async update(id: number, updateCustomerDto: any): Promise<Customer | null> {
        await this.customersRepository.update(id, updateCustomerDto);
        return this.findOne(id);
    }
}
