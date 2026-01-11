import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    name: string;

    @Column({ length: 30, nullable: true })
    phone: string;

    @Column({ length: 30 })
    type: string; // Individual / Dealer

    @Column('text', { array: true, nullable: true })
    tags: string[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
