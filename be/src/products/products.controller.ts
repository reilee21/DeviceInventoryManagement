import { Controller, Get, Post, Body, Patch, Param, Query, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    async create(@Body() createProductDto: any) {
        const product = await this.productsService.create(createProductDto);
        return {
            status: 'success',
            data: { product },
        };
    }

    @Get()
    async findAll(@Query() query: any) {
        return this.productsService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const product = await this.productsService.findOne(+id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return {
            status: 'success',
            data: { product },
        };
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateDto: any) {
        const product = await this.productsService.update(+id, updateDto);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return {
            status: 'success',
            data: { product },
        };
    }
}
