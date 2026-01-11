import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';
import { InventoryAuditSession } from './entities/inventory-audit-session.entity';
import { InventoryAuditItem } from './entities/inventory-audit-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog, InventoryAuditSession, InventoryAuditItem])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule { }
