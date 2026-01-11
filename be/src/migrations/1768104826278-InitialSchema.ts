import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1768104826278 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Roles
        await queryRunner.query(`
            CREATE TABLE roles (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE
            )
        `);

        // 2. Users
        await queryRunner.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                password VARCHAR(100) NOT NULL,
                role_id INT NOT NULL REFERENCES roles(id),
                status VARCHAR(20) NOT NULL DEFAULT 'active',
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_users_role ON users(role_id)`);

        // 3. Catalog Tables
        await queryRunner.query(`CREATE TABLE brands (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE)`);
        await queryRunner.query(`CREATE TABLE categories (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE)`);
        await queryRunner.query(`CREATE TABLE locations (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE)`);

        // 4. Product Models
        await queryRunner.query(`
            CREATE TABLE product_models (
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                brand_id INT NOT NULL REFERENCES brands(id),
                category_id INT NOT NULL REFERENCES categories(id),
                specs JSONB,
                status VARCHAR(20) NOT NULL DEFAULT 'active',
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                UNIQUE (name)
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_models_brand ON product_models(brand_id)`);
        await queryRunner.query(`CREATE INDEX idx_models_category ON product_models(category_id)`);

        // 5. Customers
        await queryRunner.query(`
            CREATE TABLE customers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                phone VARCHAR(30),
                type VARCHAR(30) NOT NULL,
                tags TEXT[],
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);

        // 6. Purchases
        await queryRunner.query(`
            CREATE TABLE purchases (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                customer_id INT REFERENCES customers(id),
                staff_id INT NOT NULL REFERENCES users(id),
                status_id INT NOT NULL,
                total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_purchases_status ON purchases(status_id)`);
        await queryRunner.query(`CREATE INDEX idx_purchases_customer ON purchases(customer_id)`);

        // 7. Product Items
        await queryRunner.query(`
            CREATE TABLE product_items (
                id SERIAL PRIMARY KEY,
                model_id INT NOT NULL REFERENCES product_models(id),
                imei_or_serial VARCHAR(50) NOT NULL UNIQUE,
                capacity VARCHAR(50),
                color VARCHAR(50),
                condition_id INT NOT NULL,
                status_id INT NOT NULL,
                purchase_price NUMERIC(14,2) NOT NULL CHECK (purchase_price >= 0),
                purchase_date DATE NOT NULL,
                purchase_id INT REFERENCES purchases(id),
                source_type_id INT,
                source_id INT REFERENCES customers(id),
                location_id INT REFERENCES locations(id),
                notes TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_items_model ON product_items(model_id)`);
        await queryRunner.query(`CREATE INDEX idx_items_status ON product_items(status_id)`);
        await queryRunner.query(`CREATE INDEX idx_items_purchase ON product_items(purchase_id)`);

        // 8. Purchase Items
        await queryRunner.query(`
            CREATE TABLE purchase_items (
                id SERIAL PRIMARY KEY,
                purchase_id INT NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
                item_id INT NOT NULL REFERENCES product_items(id),
                purchase_price NUMERIC(14,2) NOT NULL CHECK (purchase_price >= 0),
                notes TEXT,
                UNIQUE (purchase_id, item_id)
            )
        `);

        // 9. Inventory Audit
        await queryRunner.query(`
            CREATE TABLE inventory_audit_sessions (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                location_id INT REFERENCES locations(id),
                status VARCHAR(30) NOT NULL,
                created_by INT NOT NULL REFERENCES users(id),
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE inventory_audit_items (
                id SERIAL PRIMARY KEY,
                audit_session_id INT NOT NULL REFERENCES inventory_audit_sessions(id) ON DELETE CASCADE,
                item_id INT NOT NULL REFERENCES product_items(id),
                expected BOOLEAN NOT NULL,
                scanned BOOLEAN NOT NULL,
                variance_action VARCHAR(30),
                UNIQUE (audit_session_id, item_id)
            )
        `);

        // 10. Audit Logs
        await queryRunner.query(`
            CREATE TABLE audit_logs (
                id SERIAL PRIMARY KEY,
                entity_type VARCHAR(50) NOT NULL,
                entity_id INT NOT NULL,
                action VARCHAR(50) NOT NULL,
                old_value JSONB,
                new_value JSONB,
                user_id INT REFERENCES users(id),
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id)`);
        await queryRunner.query(`CREATE INDEX idx_audit_user ON audit_logs(user_id)`);

        // 11. Sales
        await queryRunner.query(`
            CREATE TABLE sales (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                customer_id INT NOT NULL REFERENCES customers(id),
                staff_id INT NOT NULL REFERENCES users(id),
                status INT NOT NULL DEFAULT 1,
                total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
                paid_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
                payment_status INT NOT NULL DEFAULT 1,
                notes TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_sales_customer ON sales(customer_id)`);
        await queryRunner.query(`CREATE INDEX idx_sales_status ON sales(status)`);

        // 12. Sale Items
        await queryRunner.query(`
            CREATE TABLE sale_items (
                id SERIAL PRIMARY KEY,
                sale_id INT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
                item_id INT NOT NULL REFERENCES product_items(id) UNIQUE,
                sale_price NUMERIC(14,2) NOT NULL CHECK (sale_price >= 0),
                notes TEXT
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_sale_items_sale ON sale_items(sale_id)`);

        // 13. Payments
        await queryRunner.query(`
            CREATE TABLE payments (
                id SERIAL PRIMARY KEY,
                sale_id INT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
                amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
                payment_method INT NOT NULL,
                payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
                reference_number VARCHAR(100),
                receiver_id INT NOT NULL REFERENCES users(id),
                notes TEXT
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_payments_sale ON payments(sale_id)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS payments`);
        await queryRunner.query(`DROP TABLE IF EXISTS sale_items`);
        await queryRunner.query(`DROP TABLE IF EXISTS sales`);
        await queryRunner.query(`DROP TABLE IF EXISTS audit_logs`);
        await queryRunner.query(`DROP TABLE IF EXISTS inventory_audit_items`);
        await queryRunner.query(`DROP TABLE IF EXISTS inventory_audit_sessions`);
        await queryRunner.query(`DROP TABLE IF EXISTS purchase_items`);
        await queryRunner.query(`DROP TABLE IF EXISTS product_items`);
        await queryRunner.query(`DROP TABLE IF EXISTS purchases`);
        await queryRunner.query(`DROP TABLE IF EXISTS product_models`);
        await queryRunner.query(`DROP TABLE IF EXISTS locations`);
        await queryRunner.query(`DROP TABLE IF EXISTS categories`);
        await queryRunner.query(`DROP TABLE IF EXISTS brands`);
        await queryRunner.query(`DROP TABLE IF EXISTS customers`);
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles`);
    }

}
