import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ProductModel } from './entities/product-model.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductModel)
        private productsRepository: Repository<ProductModel>,
    ) { }

    async create(createProductDto: Partial<ProductModel>): Promise<ProductModel> {
        const product = this.productsRepository.create(createProductDto);
        return this.productsRepository.save(product);
    }

    async findAll(query: any): Promise<any> {
        const { search, brandId, categoryId, page = 1, limit = 10 } = query;
        const take = limit;
        const skip = (page - 1) * take;

        const where: any = {};

        if (brandId) where.brandId = brandId;
        if (categoryId) where.categoryId = categoryId;
        if (search) {
            where.name = ILike(`%${search}%`);
        }

        const [results, total] = await this.productsRepository.findAndCount({
            where,
            order: { name: 'ASC' },
            relations: ['brand', 'category'],
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

    async findOne(id: number): Promise<ProductModel | null> {
        return this.productsRepository.findOne({
            where: { id },
            relations: ['brand', 'category'],
        });
    }

    async update(id: number, updateDto: any): Promise<ProductModel | null> {
        await this.productsRepository.update(id, updateDto);
        return this.findOne(id);
    }
}
