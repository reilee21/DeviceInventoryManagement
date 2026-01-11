import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Brand, Category, Location } from './entities/catalog.entities';
import { mockRepository, MockRepository } from '../../test/test-utils';

describe('CatalogService', () => {
    let service: CatalogService;
    let brandRepo: MockRepository<Brand>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CatalogService,
                { provide: getRepositoryToken(Brand), useValue: mockRepository() },
                { provide: getRepositoryToken(Category), useValue: mockRepository() },
                { provide: getRepositoryToken(Location), useValue: mockRepository() },
            ],
        }).compile();

        service = module.get<CatalogService>(CatalogService);
        brandRepo = module.get(getRepositoryToken(Brand));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('getBrands should return brands', async () => {
        (brandRepo.find as jest.Mock).mockResolvedValue([{ id: 1, name: 'Brand' }]);
        const result = await service.getBrands();
        expect(result).toHaveLength(1);
        expect(brandRepo.find).toHaveBeenCalled();
    });

    it('getConditions should return conditions', async () => {
        const result = await service.getConditions();
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
});
