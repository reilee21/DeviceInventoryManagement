import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryAuditSession } from './inventory-audit-session.entity';
import { ProductItem } from '../../inventory/entities/product-item.entity';

@Entity('inventory_audit_items')
export class InventoryAuditItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'audit_session_id' })
    auditSessionId: number;

    @ManyToOne(() => InventoryAuditSession, (session) => session.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'audit_session_id' })
    session: InventoryAuditSession;

    @Column({ name: 'item_id' })
    itemId: number;

    @ManyToOne(() => ProductItem)
    @JoinColumn({ name: 'item_id' })
    item: ProductItem;

    @Column()
    expected: boolean;

    @Column()
    scanned: boolean;

    @Column({ name: 'variance_action', length: 30, nullable: true })
    varianceAction: string; // Missing / Extra / OK
}
