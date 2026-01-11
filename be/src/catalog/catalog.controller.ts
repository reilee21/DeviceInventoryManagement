import { Controller, Get, Post, Body } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) { }

    @Get('brands')
    async getBrands() { return { status: 'success', data: { brands: await this.catalogService.getBrands() } }; }

    @Post('brands')
    async createBrand(@Body('name') name: string) { return { status: 'success', data: await this.catalogService.createBrand(name) }; }

    @Get('categories')
    async getCategories() { return { status: 'success', data: { categories: await this.catalogService.getCategories() } }; }

    @Post('categories')
    async createCategory(@Body('name') name: string) { return { status: 'success', data: await this.catalogService.createCategory(name) }; }

    @Get('conditions')
    async getConditions() { return { status: 'success', data: { conditions: await this.catalogService.getConditions() } }; }

    @Get('item-statuses')
    async getItemStatuses() { return { status: 'success', data: { statuses: await this.catalogService.getItemStatuses() } }; }

    @Get('purchase-statuses')
    async getPurchaseStatuses() { return { status: 'success', data: { statuses: await this.catalogService.getPurchaseStatuses() } }; }

    @Get('source-types')
    async getSourceTypes() { return { status: 'success', data: { sources: await this.catalogService.getSourceTypes() } }; }

    @Get('locations')
    async getLocations() { return { status: 'success', data: { locations: await this.catalogService.getLocations() } }; }

    @Post('locations')
    async createLocation(@Body('name') name: string) { return { status: 'success', data: await this.catalogService.createLocation(name) }; }
}
