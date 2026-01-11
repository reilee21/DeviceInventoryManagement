import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { InventoryAuditSession } from './entities/inventory-audit-session.entity';
import { mockRepository, MockRepository } from '../../test/test-utils';

describe('AuditService', () => {
    let service: AuditService;
    let logsRepo: MockRepository<AuditLog>;
    let sessionsRepo: MockRepository<InventoryAuditSession>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuditService,
                { provide: getRepositoryToken(AuditLog), useValue: mockRepository() },
                { provide: getRepositoryToken(InventoryAuditSession), useValue: mockRepository() },
            ],
        }).compile();

        service = module.get<AuditService>(AuditService);
        logsRepo = module.get(getRepositoryToken(AuditLog));
        sessionsRepo = module.get(getRepositoryToken(InventoryAuditSession));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('logAction', () => {
        it('should create and save a log', async () => {
            const log = { action: 'test' };
            logsRepo.create.mockReturnValue(log);
            logsRepo.save.mockResolvedValue({ id: 1, ...log });

            const result = await service.logAction('test', 'User', 1, 1);
            expect(result.id).toBe(1);
            expect(logsRepo.save).toHaveBeenCalled();
        });
    });

    describe('createSession', () => {
        it('should create and save a session', async () => {
            const session = { code: 'AUDIT-123' };
            sessionsRepo.create.mockReturnValue(session);
            sessionsRepo.save.mockResolvedValue({ id: 1, ...session });

            const result = await service.createSession(1);
            expect(result.id).toBe(1);
            expect(sessionsRepo.save).toHaveBeenCalled();
        });
    });
});
