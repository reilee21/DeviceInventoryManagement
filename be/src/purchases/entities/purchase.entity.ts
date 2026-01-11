import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import { PurchaseStatusEnum } from '../../catalog/entities/catalog.entities';
import { PurchaseItem } from './purchase-item.entity';

@Entity('purchases')
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    code: string;

    @Column({ name: 'customer_id', nullable: true })
    customerId: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ name: 'staff_id' })
    staffId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'staff_id' })
    staff: User;

    @Column({ name: 'status_id', type: 'int' })
    statusId: PurchaseStatusEnum;

    @Column({ name: 'total_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
    totalAmount: number;

    @OneToMany(() => PurchaseItem, (item) => item.purchase, { cascade: true })
    items: PurchaseItem[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
