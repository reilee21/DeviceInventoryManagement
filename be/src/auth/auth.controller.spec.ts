import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        register: jest.fn(),
        validateUser: jest.fn(),
        login: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('register', () => {
        it('should call authService.register', async () => {
            const userData = { email: 'test@test.com' };
            mockAuthService.register.mockResolvedValue({ id: 1, ...userData });
            const result = await controller.register(userData);
            expect(result.status).toBe('success');
            expect(authService.register).toHaveBeenCalledWith(userData);
        });
    });

    describe('login', () => {
        it('should return fail if user is invalid', async () => {
            mockAuthService.validateUser.mockResolvedValue(null);
            const result = await controller.login({ email: 'test@test.com', password: 'password' });
            expect(result.status).toBe('fail');
        });

        it('should call authService.login if user is valid', async () => {
            const user = { id: 1, email: 'test@test.com' };
            mockAuthService.validateUser.mockResolvedValue(user);
            mockAuthService.login.mockResolvedValue({ status: 'success', access_token: 'token' });
            const result: any = await controller.login({ email: 'test@test.com', password: 'password' });
            expect(authService.login).toHaveBeenCalledWith(user);
            expect(result.access_token).toBe('token');
        });
    });
});
