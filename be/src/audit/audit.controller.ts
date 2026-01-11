import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
// Assuming AuthGuard is available globally or we can import it, for now we skip explicit auth in scaffold
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get('logs')
    async getLogs(@Query() query: any) {
        return this.auditService.getLogs(query);
    }

    @Post('sessions')
    async createSession(@Body() body: any) {
        // userId should come from req.user
        const userId = body.userId || 1; // Default for dev if no auth context passed for now
        const session = await this.auditService.createSession(userId);
        return { status: 'success', data: { session } };
    }

    @Get('sessions')
    async getSessions(@Query() query: any) {
        return this.auditService.getSessions(query);
    }
}
