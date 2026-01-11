import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Payment } from './entities/payment.entity';
import { ProductItem } from '../inventory/entities/product-item.entity';
import { DataSource } from 'typeorm';
import { mockRepository, MockRepository } from '../../test/test-utils';
import { NotFoundException } from '@nestjs/common';

describe('SalesService', () => {
    let service: SalesService;
    let salesRepo: MockRepository<Sale>;

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn(),
            findOne: jest.fn(),
        },
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SalesService,
                { provide: getRepositoryToken(Sale), useValue: mockRepository() },
                { provide: getRepositoryToken(SaleItem), useValue: mockRepository() },
                { provide: getRepositoryToken(Payment), useValue: mockRepository() },
                { provide: getRepositoryToken(ProductItem), useValue: mockRepository() },
                { provide: DataSource, useValue: mockDataSource },
            ],
        }).compile();

        service = module.get<SalesService>(SalesService);
        salesRepo = module.get(getRepositoryToken(Sale));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should throw NotFoundException if sale not found', async () => {
            salesRepo.findOne.mockResolvedValue(null);
            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });

        it('should return a sale', async () => {
            const sale = { id: 1, code: 'S001' };
            salesRepo.findOne.mockResolvedValue(sale);
            const result = await service.findOne(1);
            expect(result).toEqual(sale);
        });
    });

    describe('create', () => {
        it('should create a sale successfully', async () => {
            const createDto = {
                code: 'S001',
                customerId: 1,
                staffId: 1,
                items: [{ itemId: 1, salePrice: 100 }]
            };

            salesRepo.create.mockReturnValue({ id: 1, ...createDto });
            mockQueryRunner.manager.save.mockImplementation(async (entity) => entity);
            mockQueryRunner.manager.findOne.mockResolvedValue({ id: 1, statusId: 1 });

            // Mock findOne for the final return
            salesRepo.findOne.mockResolvedValue({ id: 1, code: 'S001' });

            const result = await service.create(createDto);
            expect(result).toBeDefined();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        it('should rollback transaction on error', async () => {
            const createDto = { items: [] };
            salesRepo.create.mockImplementation(() => { throw new Error('DB Error'); });

            await expect(service.create(createDto)).rejects.toThrow();
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });
    });
});
