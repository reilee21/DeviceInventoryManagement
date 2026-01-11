import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { NotFoundException } from '@nestjs/common';

describe('CustomersController', () => {
    let controller: CustomersController;
    let service: CustomersService;

    const mockCustomersService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CustomersController],
            providers: [
                { provide: CustomersService, useValue: mockCustomersService },
            ],
        }).compile();

        controller = module.get<CustomersController>(CustomersController);
        service = module.get<CustomersService>(CustomersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findOne', () => {
        it('should throw NotFoundException if customer not found', async () => {
            mockCustomersService.findOne.mockResolvedValue(null);
            await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
        });

        it('should return a customer', async () => {
            const customer = { id: 1, name: 'John' };
            mockCustomersService.findOne.mockResolvedValue(customer);
            const result = await controller.findOne('1');
            expect(result.data.customer).toEqual(customer);
        });
    });
});
