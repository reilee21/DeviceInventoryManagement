import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { SaleItem } from './sale-item.entity';
import { Payment } from './payment.entity';
import { SaleStatus, PaymentStatus } from '../sales.constants';

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column({ name: 'customer_id' })
    customerId: number;

    @Column({ name: 'staff_id' })
    staffId: number;

    @Column({
        type: 'int',
        default: SaleStatus.DRAFT,
    })
    status: SaleStatus;

    @Column({ name: 'total_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ name: 'paid_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
    paidAmount: number;

    @Column({
        name: 'payment_status',
        type: 'int',
        default: PaymentStatus.UNPAID,
    })
    paymentStatus: PaymentStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'staff_id' })
    staff: User;

    @OneToMany(() => SaleItem, (item) => item.sale)
    items: SaleItem[];

    @OneToMany(() => Payment, (payment) => payment.sale)
    payments: Payment[];
}
