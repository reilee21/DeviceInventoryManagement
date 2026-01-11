import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesService } from './purchases.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { DataSource } from 'typeorm';
import { mockRepository, MockRepository } from '../../test/test-utils';

describe('PurchasesService', () => {
    let service: PurchasesService;
    let repository: MockRepository<Purchase>;

    const mockDataSource = {
        createQueryRunner: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PurchasesService,
                { provide: getRepositoryToken(Purchase), useValue: mockRepository() },
                { provide: DataSource, useValue: mockDataSource },
            ],
        }).compile();

        service = module.get<PurchasesService>(PurchasesService);
        repository = module.get(getRepositoryToken(Purchase));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated results', async () => {
            repository.findAndCount.mockResolvedValue([[], 0]);
            const result = await service.findAll({ page: 1 });
            expect(result.data).toBeDefined();
            expect(repository.findAndCount).toHaveBeenCalled();
        });
    });
});
