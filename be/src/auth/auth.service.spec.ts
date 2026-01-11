import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    const mockUsersService = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        it('should throw BadRequestException if email is already in use', async () => {
            mockUsersService.findByEmail.mockResolvedValue({ id: 1 });
            await expect(service.register({ email: 'test@test.com' })).rejects.toThrow(BadRequestException);
        });

        it('should register a new user', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockResolvedValue({ id: 1, email: 'test@test.com' });

            const result = await service.register({ email: 'test@test.com', password: 'password', name: 'Test' });
            expect(result).toBeDefined();
            expect(mockUsersService.create).toHaveBeenCalled();
        });
    });

    describe('validateUser', () => {
        it('should return null if user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            const result = await service.validateUser('test@test.com', 'password');
            expect(result).toBeNull();
        });

        it('should return user without password if validation succeeds', async () => {
            const password = 'password';
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const user = { id: 1, email: 'test@test.com', password: hash };

            mockUsersService.findByEmail.mockResolvedValue(user);
            const result = await service.validateUser('test@test.com', password);
            expect(result).not.toHaveProperty('password');
            expect(result.email).toBe('test@test.com');
        });
    });

    describe('login', () => {
        it('should return an access token', async () => {
            const user = { id: 1, email: 'test@test.com' };
            mockJwtService.sign.mockReturnValue('token');
            const result = await service.login(user);
            expect(result.access_token).toBe('token');
            expect(result.status).toBe('success');
        });
    });
});
