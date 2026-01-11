import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

describe('CatalogController', () => {
    let controller: CatalogController;
    let service: CatalogService;

    const mockCatalogService = {
        getBrands: jest.fn(),
        createBrand: jest.fn(),
        getCategories: jest.fn(),
        createCategory: jest.fn(),
        getConditions: jest.fn(),
        getItemStatuses: jest.fn(),
        getPurchaseStatuses: jest.fn(),
        getSourceTypes: jest.fn(),
        getLocations: jest.fn(),
        createLocation: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CatalogController],
            providers: [
                { provide: CatalogService, useValue: mockCatalogService },
            ],
        }).compile();

        controller = module.get<CatalogController>(CatalogController);
        service = module.get<CatalogService>(CatalogService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('getBrands should return brands', async () => {
        mockCatalogService.getBrands.mockResolvedValue([{ id: 1, name: 'Brand' }]);
        const result = await controller.getBrands();
        expect(result.status).toBe('success');
        expect(result.data.brands).toHaveLength(1);
    });

    it('createBrand should call service.createBrand', async () => {
        mockCatalogService.createBrand.mockResolvedValue({ id: 1, name: 'New Brand' });
        const result = await controller.createBrand('New Brand');
        expect(result.status).toBe('success');
        expect(service.createBrand).toHaveBeenCalledWith('New Brand');
    });
});
