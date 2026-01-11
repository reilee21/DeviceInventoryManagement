import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() userData: any) {
        const user = await this.authService.register(userData);
        return {
            status: 'success',
            data: { user },
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            return {
                status: 'fail',
                message: 'Invalid email or password',
            };
        }
        return this.authService.login(user);
    }
}
