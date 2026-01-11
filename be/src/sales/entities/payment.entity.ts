import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { User } from '../../users/entities/user.entity';
import { PaymentMethod } from '../sales.constants';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'sale_id' })
    saleId: number;

    @Column({ type: 'numeric', precision: 14, scale: 2 })
    amount: number;

    @Column({
        name: 'payment_method',
        type: 'int',
    })
    paymentMethod: PaymentMethod;

    @CreateDateColumn({ name: 'payment_date' })
    paymentDate: Date;

    @Column({ name: 'reference_number', length: 100, nullable: true })
    referenceNumber: string;

    @Column({ name: 'receiver_id' })
    receiverId: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @ManyToOne(() => Sale, (sale) => sale.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiver_id' })
    receiver: User;
}
