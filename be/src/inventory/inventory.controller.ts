import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('items')
    async create(@Body() body: any) {
        const item = await this.inventoryService.create(body);
        return { status: 'success', data: { item } };
    }

    @Get('items')
    async findAll(@Query() query: any) {
        return this.inventoryService.findAll(query);
    }

    @Get('items/:id')
    async findOne(@Param('id') id: string) {
        const item = await this.inventoryService.findOne(+id);
        return { status: 'success', data: { item } };
    }
}
