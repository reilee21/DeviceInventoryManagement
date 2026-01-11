import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'entity_type', length: 50 })
    entityType: string;

    @Column({ name: 'entity_id' })
    entityId: number;

    @Column({ length: 50 })
    action: string;

    @Column('jsonb', { name: 'old_value', nullable: true })
    oldValue: any;

    @Column('jsonb', { name: 'new_value', nullable: true })
    newValue: any;

    @Column({ name: 'user_id', nullable: true })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
