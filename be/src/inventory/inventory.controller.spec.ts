import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

describe('InventoryController', () => {
    let controller: InventoryController;
    let service: InventoryService;

    const mockInventoryService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InventoryController],
            providers: [
                { provide: InventoryService, useValue: mockInventoryService },
            ],
        }).compile();

        controller = module.get<InventoryController>(InventoryController);
        service = module.get<InventoryService>(InventoryService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create an inventory item', async () => {
            const dto = { imeiOrSerial: '123' };
            mockInventoryService.create.mockResolvedValue({ id: 1, ...dto });
            const result = await controller.create(dto);
            expect(result.status).toBe('success');
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all inventory items', async () => {
            const query = { page: 1 };
            mockInventoryService.findAll.mockResolvedValue({ data: [], total: 0 });
            const result = await controller.findAll(query);
            expect(result.data).toBeDefined();
            expect(service.findAll).toHaveBeenCalledWith(query);
        });
    });
});
