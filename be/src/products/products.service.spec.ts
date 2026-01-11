import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductModel } from './entities/product-model.entity';
import { mockRepository, MockRepository } from '../../test/test-utils';

describe('ProductsService', () => {
    let service: ProductsService;
    let repository: MockRepository<ProductModel>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                { provide: getRepositoryToken(ProductModel), useValue: mockRepository() },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        repository = module.get(getRepositoryToken(ProductModel));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated results', async () => {
            const products = [{ id: 1, name: 'iPhone' }];
            (repository.findAndCount as jest.Mock).mockResolvedValue([products, 1]);

            const result = await service.findAll({ page: 1, limit: 10 });
            expect(result.data).toHaveLength(1);
            expect(result.total).toBe(1);
            expect(result.page).toBe(1);
        });
    });

    describe('findOne', () => {
        it('should return a product', async () => {
            const product = { id: 1, name: 'iPhone' };
            repository.findOne.mockResolvedValue(product);

            const result = await service.findOne(1);
            expect(result).toEqual(product);
        });
    });
});
