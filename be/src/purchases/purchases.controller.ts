import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) { }

    @Post()
    async create(@Body() body: any) {
        const purchase = await this.purchasesService.create(body);
        return { status: 'success', data: { purchase } };
    }

    @Get()
    async findAll(@Query() query: any) {
        return this.purchasesService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const purchase = await this.purchasesService.findOne(+id);
        return { status: 'success', data: { purchase } };
    }
}
