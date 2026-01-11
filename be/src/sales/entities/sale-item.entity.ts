import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { ProductItem } from '../../inventory/entities/product-item.entity';

@Entity('sale_items')
export class SaleItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'sale_id' })
    saleId: number;

    @Column({ name: 'item_id', unique: true })
    itemId: number;

    @Column({ name: 'sale_price', type: 'numeric', precision: 14, scale: 2 })
    salePrice: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @ManyToOne(() => ProductItem)
    @JoinColumn({ name: 'item_id' })
    item: ProductItem;
}
