import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

describe('AuditController', () => {
    let controller: AuditController;
    let service: AuditService;

    const mockAuditService = {
        getLogs: jest.fn(),
        createSession: jest.fn(),
        getSessions: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuditController],
            providers: [
                { provide: AuditService, useValue: mockAuditService },
            ],
        }).compile();

        controller = module.get<AuditController>(AuditController);
        service = module.get<AuditService>(AuditService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getLogs', () => {
        it('should call auditService.getLogs', async () => {
            mockAuditService.getLogs.mockResolvedValue({ data: [], total: 0 });
            await controller.getLogs({ page: 1 });
            expect(service.getLogs).toHaveBeenCalled();
        });
    });

    describe('createSession', () => {
        it('should call auditService.createSession', async () => {
            const session = { id: 1, code: 'AUDIT-123' };
            mockAuditService.createSession.mockResolvedValue(session);
            const result = await controller.createSession({ userId: 1 });
            expect(result.data.session).toEqual(session);
            expect(service.createSession).toHaveBeenCalledWith(1);
        });
    });
});
