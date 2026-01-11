import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { mockRepository, MockRepository } from '../../test/test-utils';

describe('UsersService', () => {
    let service: UsersService;
    let usersRepository: MockRepository<User>;
    let rolesRepository: MockRepository<Role>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useValue: mockRepository() },
                { provide: getRepositoryToken(Role), useValue: mockRepository() },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        usersRepository = module.get(getRepositoryToken(User));
        rolesRepository = module.get(getRepositoryToken(Role));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create and save a user', async () => {
            const userDto = { name: 'Test', email: 'test@test.com' };
            usersRepository.create.mockReturnValue(userDto);
            usersRepository.save.mockResolvedValue({ id: 1, ...userDto });

            const result = await service.create(userDto);
            expect(result.id).toBe(1);
            expect(usersRepository.create).toHaveBeenCalledWith(userDto);
            expect(usersRepository.save).toHaveBeenCalled();
        });
    });

    describe('findByEmail', () => {
        it('should find a user by email', async () => {
            const user = { id: 1, email: 'test@test.com' };
            usersRepository.findOne.mockResolvedValue(user);

            const result = await service.findByEmail('test@test.com');
            expect(result).toEqual(user);
            expect(usersRepository.findOne).toHaveBeenCalled();
        });
    });
});
