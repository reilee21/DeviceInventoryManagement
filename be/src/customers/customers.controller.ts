import { Controller, Get, Post, Body, Patch, Param, Query, NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post()
    async create(@Body() createCustomerDto: any) {
        const customer = await this.customersService.create(createCustomerDto);
        return {
            status: 'success',
            data: { customer },
        };
    }

    @Get()
    async findAll(@Query() query: any) {
        return this.customersService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const customer = await this.customersService.findOne(+id);
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }
        return {
            status: 'success',
            data: { customer },
        };
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCustomerDto: any) {
        const customer = await this.customersService.update(+id, updateCustomerDto);
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }
        return {
            status: 'success',
            data: { customer },
        };
    }
}
