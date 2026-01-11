import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Purchase } from './purchase.entity';
import { ProductItem } from '../../inventory/entities/product-item.entity';

@Entity('purchase_items')
export class PurchaseItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'purchase_id' })
    purchaseId: number;

    @ManyToOne(() => Purchase, (purchase) => purchase.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'purchase_id' })
    purchase: Purchase;

    @Column({ name: 'item_id' })
    itemId: number;

    @ManyToOne(() => ProductItem)
    @JoinColumn({ name: 'item_id' })
    item: ProductItem;

    @Column({ name: 'purchase_price', type: 'numeric', precision: 14, scale: 2 })
    purchasePrice: number;

    @Column('text', { nullable: true })
    notes: string;
}
