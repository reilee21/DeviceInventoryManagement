import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { mockRepository, MockRepository } from '../../test/test-utils';

describe('CustomersService', () => {
    let service: CustomersService;
    let repository: MockRepository<Customer>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomersService,
                { provide: getRepositoryToken(Customer), useValue: mockRepository() },
            ],
        }).compile();

        service = module.get<CustomersService>(CustomersService);
        repository = module.get(getRepositoryToken(Customer));
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
