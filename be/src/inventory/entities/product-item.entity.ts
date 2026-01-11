import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ProductModel } from '../../products/entities/product-model.entity';
import { ConditionEnum, ItemStatusEnum, SourceTypeEnum, Location } from '../../catalog/entities/catalog.entities';
import { Purchase } from '../../purchases/entities/purchase.entity';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('product_items')
export class ProductItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'model_id' })
    modelId: number;

    @ManyToOne(() => ProductModel)
    @JoinColumn({ name: 'model_id' })
    model: ProductModel;

    @Column({ name: 'imei_or_serial', length: 50, unique: true })
    imeiOrSerial: string;

    @Column({ length: 50, nullable: true })
    capacity: string;

    @Column({ length: 50, nullable: true })
    color: string;

    @Column({ name: 'condition_id', type: 'int' })
    conditionId: ConditionEnum;

    @Column({ name: 'status_id', type: 'int' })
    statusId: ItemStatusEnum;

    @Column({ name: 'purchase_price', type: 'numeric', precision: 14, scale: 2 })
    purchasePrice: number;

    @Column({ name: 'purchase_date', type: 'date' })
    purchaseDate: string; // TypeORM maps decimals and dates primarily as strings or custom objects, string is safe for dates

    @Column({ name: 'purchase_id', nullable: true })
    purchaseId: number;

    // We need to use forwardRef if circular dependency occurs, but usually ManyToOne side is fine if entity is imported.
    // Ideally, put types in a shared location or carefully structure imports.
    // Purchase entity isn't created yet in this tool call sequence, so this import might fail if I don't create Purchase entity simultaneously.
    // I will assume sequential creation or stub it.

    @ManyToOne(() => Purchase) // String reference to avoid circular dep issues early on
    @JoinColumn({ name: 'purchase_id' })
    purchase: Purchase;

    @Column({ name: 'source_type_id', type: 'int', nullable: true })
    sourceTypeId: SourceTypeEnum;

    @Column({ name: 'source_id', nullable: true }) // Can be customer or other source
    sourceId: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'source_id' })
    source: Customer;

    @Column({ name: 'location_id', nullable: true })
    locationId: number;

    @ManyToOne(() => Location)
    @JoinColumn({ name: 'location_id' })
    location: Location;

    @Column('text', { nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
