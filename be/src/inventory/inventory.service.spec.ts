import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductItem } from './entities/product-item.entity';
import { mockRepository, MockRepository } from '../../test/test-utils';

describe('InventoryService', () => {
    let service: InventoryService;
    let repository: MockRepository<ProductItem>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InventoryService,
                { provide: getRepositoryToken(ProductItem), useValue: mockRepository() },
            ],
        }).compile();

        service = module.get<InventoryService>(InventoryService);
        repository = module.get(getRepositoryToken(ProductItem));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated results', async () => {
            const items = [{ id: 1, imeiOrSerial: '123' }];
            repository.findAndCount.mockResolvedValue([items, 1]);

            const result = await service.findAll({ page: 1, limit: 10 });
            expect(result.data).toHaveLength(1);
            expect(result.total).toBe(1);
        });
    });

    describe('findOne', () => {
        it('should return an item', async () => {
            const item = { id: 1, imeiOrSerial: '123' };
            repository.findOne.mockResolvedValue(item);

            const result = await service.findOne(1);
            expect(result).toEqual(item);
        });
    });
});
