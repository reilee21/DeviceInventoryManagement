import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
    let controller: ProductsController;
    let service: ProductsService;

    const mockProductsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                { provide: ProductsService, useValue: mockProductsService },
            ],
        }).compile();

        controller = module.get<ProductsController>(ProductsController);
        service = module.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a product', async () => {
            const dto = { name: 'iPhone' };
            mockProductsService.create.mockResolvedValue({ id: 1, ...dto });
            const result = await controller.create(dto);
            expect(result.status).toBe('success');
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findOne', () => {
        it('should throw NotFoundException if product not found', async () => {
            mockProductsService.findOne.mockResolvedValue(null);
            await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
        });

        it('should return a product', async () => {
            const product = { id: 1, name: 'iPhone' };
            mockProductsService.findOne.mockResolvedValue(product);
            const result = await controller.findOne('1');
            expect(result.data.product).toEqual(product);
        });
    });
});
