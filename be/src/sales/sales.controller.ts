import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('sales')
@UseGuards(AuthGuard('jwt'))
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.salesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(+id);
    }

    @Post()
    create(@Body() createDto: any) {
        return this.salesService.create(createDto);
    }

    @Post(':id/payments')
    addPayment(@Param('id') id: string, @Body() paymentDto: any) {
        return this.salesService.addPayment(+id, paymentDto);
    }
}
