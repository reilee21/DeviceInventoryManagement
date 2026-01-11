import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductsController } from '../src/products/products.controller';
import { ProductsService } from '../src/products/products.service';
import { InventoryController } from '../src/inventory/inventory.controller';
import { InventoryService } from '../src/inventory/inventory.service';
import { PurchasesController } from '../src/purchases/purchases.controller';
import { PurchasesService } from '../src/purchases/purchases.service';
import { SalesController } from '../src/sales/sales.controller';
import { SalesService } from '../src/sales/sales.service';
import { AuditController } from '../src/audit/audit.controller';
import { AuditService } from '../src/audit/audit.service';
import { AuthGuard } from '@nestjs/passport';

describe('API (e2e)', () => {
    let app: INestApplication;

    const mockProductsService = {
        findAll: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        create: jest.fn().mockResolvedValue({ status: 'success', data: { product: { id: 1, name: 'Test' } } }),
    };

    const mockInventoryService = {
        findAll: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        create: jest.fn().mockResolvedValue({ id: 1 }),
    };

    const mockPurchasesService = {
        findAll: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        create: jest.fn().mockResolvedValue({ id: 1, code: 'P001' }),
    };

    const mockSalesService = {
        findAll: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        create: jest.fn().mockResolvedValue({ status: 'success', data: { sale: { id: 1 } } }),
        addPayment: jest.fn().mockResolvedValue({ id: 1 }),
    };

    const mockAuditService = {
        getLogs: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        createSession: jest.fn().mockResolvedValue({ id: 1 }),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [
                ProductsController,
                InventoryController,
                PurchasesController,
                SalesController,
                AuditController,
            ],
            providers: [
                { provide: ProductsService, useValue: mockProductsService },
                { provide: InventoryService, useValue: mockInventoryService },
                { provide: PurchasesService, useValue: mockPurchasesService },
                { provide: SalesService, useValue: mockSalesService },
                { provide: AuditService, useValue: mockAuditService },
            ],
        })
            .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/products (GET)', () => {
        return request(app.getHttpServer())
            .get('/products')
            .expect(200);
    });

    it('/products (POST)', () => {
        return request(app.getHttpServer())
            .post('/products')
            .send({ name: 'iPhone 15', brandId: 1, categoryId: 1 })
            .expect(201)
            .expect((res) => {
                expect(res.body.status).toBe('success');
                expect(res.body.data.product).toBeDefined();
            });
    });

    it('/inventory/items (GET)', () => {
        return request(app.getHttpServer())
            .get('/inventory/items')
            .expect(200);
    });

    it('/inventory/items (POST)', () => {
        return request(app.getHttpServer())
            .post('/inventory/items')
            .send({ modelId: 1, imeiOrSerial: '123456', purchasePrice: 1000, purchaseDate: '2023-01-01' })
            .expect(201)
            .expect((res) => {
                expect(res.body.status).toBe('success');
                expect(res.body.data.item).toBeDefined();
            });
    });

    it('/purchases (GET)', () => {
        return request(app.getHttpServer())
            .get('/purchases')
            .expect(200);
    });

    it('/purchases (POST)', () => {
        return request(app.getHttpServer())
            .post('/purchases')
            .send({ customerId: 1, staffId: 1, items: [] })
            .expect(201)
            .expect((res) => {
                expect(res.body.status).toBe('success');
                expect(res.body.data.purchase).toBeDefined();
            });
    });

    it('/sales (GET)', () => {
        return request(app.getHttpServer())
            .get('/sales')
            .expect(200);
    });

    it('/sales (POST)', () => {
        return request(app.getHttpServer())
            .post('/sales')
            .send({ customerId: 1, staffId: 1, items: [{ itemId: 1, price: 1200 }] })
            .expect(201);
    });

    it('/sales/:id/payments (POST)', () => {
        return request(app.getHttpServer())
            .post('/sales/1/payments')
            .send({ amount: 500, method: 'cash' })
            .expect(201);
    });

    it('/audit/logs (GET)', () => {
        return request(app.getHttpServer())
            .get('/audit/logs')
            .expect(200);
    });

    it('/audit/sessions (POST)', () => {
        return request(app.getHttpServer())
            .post('/audit/sessions')
            .send({ userId: 1 })
            .expect(201)
            .expect((res) => {
                expect(res.body.status).toBe('success');
                expect(res.body.data.session).toBeDefined();
            });
    });
});
