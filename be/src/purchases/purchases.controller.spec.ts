import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';

describe('PurchasesController', () => {
    let controller: PurchasesController;
    let service: PurchasesService;

    const mockPurchasesService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PurchasesController],
            providers: [
                { provide: PurchasesService, useValue: mockPurchasesService },
            ],
        }).compile();

        controller = module.get<PurchasesController>(PurchasesController);
        service = module.get<PurchasesService>(PurchasesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a purchase', async () => {
            const dto = { totalAmount: 100 };
            mockPurchasesService.create.mockResolvedValue({ id: 1, ...dto });
            const result = await controller.create(dto);
            expect(result.status).toBe('success');
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });
});
