import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Brand, Category, Location } from './entities/catalog.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand, Category, Location
    ])
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule { }
