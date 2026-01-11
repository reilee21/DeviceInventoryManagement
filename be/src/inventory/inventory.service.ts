import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductItem } from './entities/product-item.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(ProductItem)
        private itemsRepo: Repository<ProductItem>,
    ) { }

    async create(data: Partial<ProductItem>): Promise<ProductItem> {
        const item = this.itemsRepo.create(data);
        return this.itemsRepo.save(item);
    }

    async findAll(query: any): Promise<any> {
        const { modelId, imei, page = 1, limit = 10 } = query;
        const take = limit;
        const skip = (page - 1) * take;

        const where: any = {};
        if (modelId) where.modelId = modelId;
        if (imei) where.imeiOrSerial = imei;

        const [results, total] = await this.itemsRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            relations: ['model', 'condition', 'itemStatus', 'location'],
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

    async findOne(id: number): Promise<ProductItem | null> {
        return this.itemsRepo.findOne({
            where: { id },
            relations: ['model', 'condition', 'itemStatus', 'location', 'purchase', 'source', 'sourceType'],
        });
    }
}
