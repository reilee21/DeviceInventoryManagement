import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../catalog/entities/catalog.entities';
import { InventoryAuditItem } from './inventory-audit-item.entity';

@Entity('inventory_audit_sessions')
export class InventoryAuditSession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    code: string;

    @Column({ name: 'location_id', nullable: true })
    locationId: number;

    @ManyToOne(() => Location)
    @JoinColumn({ name: 'location_id' })
    location: Location;

    @Column({ length: 30 }) // Draft, Submitted, Posted
    status: string;

    @Column({ name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => InventoryAuditItem, (item) => item.session, { cascade: true })
    items: InventoryAuditItem[];
}
