import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Brand, Category, Location,
    CONDITION_LABELS, ITEM_STATUS_LABELS, PURCHASE_STATUS_LABELS, SOURCE_TYPE_LABELS
} from './entities/catalog.entities';

@Injectable()
export class CatalogService {
    constructor(
        @InjectRepository(Brand) private brandRepo: Repository<Brand>,
        @InjectRepository(Category) private categoryRepo: Repository<Category>,
        @InjectRepository(Location) private locationRepo: Repository<Location>,
    ) { }

    async getBrands() { return this.brandRepo.find(); }
    async createBrand(name: string) { return this.brandRepo.save(this.brandRepo.create({ name })); }

    async getCategories() { return this.categoryRepo.find(); }
    async createCategory(name: string) { return this.categoryRepo.save(this.categoryRepo.create({ name })); }

    async getConditions() {
        return Object.entries(CONDITION_LABELS).map(([id, name]) => ({ id: Number(id), name }));
    }

    async getItemStatuses() {
        return Object.entries(ITEM_STATUS_LABELS).map(([id, name]) => ({ id: Number(id), name }));
    }

    async getPurchaseStatuses() {
        return Object.entries(PURCHASE_STATUS_LABELS).map(([id, name]) => ({ id: Number(id), name }));
    }

    async getSourceTypes() {
        return Object.entries(SOURCE_TYPE_LABELS).map(([id, name]) => ({ id: Number(id), name }));
    }

    async getLocations() { return this.locationRepo.find(); }
    async createLocation(name: string) { return this.locationRepo.save(this.locationRepo.create({ name })); }
}
