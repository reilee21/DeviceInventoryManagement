import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { AuthGuard } from '@nestjs/passport';

describe('SalesController', () => {
    let controller: SalesController;
    let service: SalesService;

    const mockSalesService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        addPayment: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SalesController],
            providers: [
                { provide: SalesService, useValue: mockSalesService },
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<SalesController>(SalesController);
        service = module.get<SalesService>(SalesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should call salesService.findAll', async () => {
            mockSalesService.findAll.mockResolvedValue({ data: [], total: 0 });
            await controller.findAll({ page: 1 });
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should call salesService.create', async () => {
            const dto = { customerId: 1, items: [] };
            mockSalesService.create.mockResolvedValue({ id: 1, ...dto });
            await controller.create(dto);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });
});
