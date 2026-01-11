import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Payment } from './entities/payment.entity';
import { ProductItem } from '../inventory/entities/product-item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sale, SaleItem, Payment, ProductItem])],
    controllers: [SalesController],
    providers: [SalesService],
})
export class SalesModule { }
