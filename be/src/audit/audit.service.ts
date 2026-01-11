import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { InventoryAuditSession } from './entities/inventory-audit-session.entity';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private logsRepo: Repository<AuditLog>,
        @InjectRepository(InventoryAuditSession)
        private sessionsRepo: Repository<InventoryAuditSession>,
    ) { }

    async logAction(action: string, entityType: string, entityId: number, userId: number, oldVal?: any, newVal?: any) {
        const log = this.logsRepo.create({
            action,
            entityType,
            entityId,
            userId,
            oldValue: oldVal,
            newValue: newVal,
        });
        return this.logsRepo.save(log);
    }

    async getLogs(query: any): Promise<any> {
        const { page = 1, limit = 10 } = query;
        const take = limit;
        const skip = (page - 1) * take;

        const [results, total] = await this.logsRepo.findAndCount({
            order: { createdAt: 'DESC' },
            take,
            skip,
            relations: ['user'],
        });

        return {
            data: results,
            total,
            page: +page,
            lastPage: Math.ceil(total / take),
        };
    }

    async createSession(userId: number) {
        const session = this.sessionsRepo.create({
            code: `AUDIT-${Date.now()}`,
            createdBy: userId,
            status: 'Draft',
        });
        return this.sessionsRepo.save(session);
    }

    async getSessions(query: any): Promise<any> {
        const { page = 1, limit = 10 } = query;
        const take = limit;
        const skip = (page - 1) * take;

        const [results, total] = await this.sessionsRepo.findAndCount({
            order: { createdAt: 'DESC' },
            relations: ['creator', 'items', 'items.item'],
            take,
            skip,
        });

        return {
            data: results,
            total,
            page: +page,
            lastPage: Math.ceil(total / take),
        };
    }
}
