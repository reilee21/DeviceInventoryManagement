# 📱 Mobile Device Inventory Management System

A full-stack system for managing mobile device inventory with **item-level tracking (IMEI / Serial)**, covering **purchase, stock, sales, installment payments**, and **auditability**.

> This project focuses on modeling **real-world inventory operations** with clean architecture and explicit business workflows.

---

## 🧠 Why This Project Exists

Most inventory systems stop at **quantity-based stock**.  
This project goes further by treating **each physical device as a first-class entity**, allowing:

- Accurate tracking by **IMEI / Serial**
- Full lifecycle visibility of a device
- Strong auditability for operational correctness

It is designed as both:
- a **production-ready foundation**, and  
- a **technical showcase** of backend & frontend architecture.

---

## 🧩 Key Concepts

- **Item-level inventory** instead of aggregated stock
- Explicit **business workflows** (Purchase → In Stock → Sale → Warranty / Liquidation)
- **Audit-first design** for traceability
- Clear separation of domains using a **modular monolith**

---

## 🛠 Tech Stack

### Backend
- NestJS (TypeScript)
- PostgreSQL
- TypeORM (migrations-based)
- JWT Authentication (Passport.js)
- Architecture: Modular Monolith

### Frontend
- React (Vite)
- Tailwind CSS
- Shadcn UI (Radix primitives)
- Axios, React Router

### Infrastructure
- Docker
- Docker Compose (Dev / Prod separation)

---

## 🚀 Features

### Inventory
- Track each device by **IMEI / Serial**
- Inventory status lifecycle:
  - InStock
  - Liquidated
  - WarrantyReturn
- Inventory items are immutable identifiers

### Catalog
- Centralized management of Brands, Categories, and Locations

### Purchasing
- Create and manage purchase orders
- Auto-generate inventory items from purchases

### Sales & Payments
- Sales containing multiple inventory items
- Installment-based payment support

### Audit System
- Entity audit logs (old / new values)
- Inventory audit sessions with variance reporting

---

## 📂 Project Structure

.
├── be/
├── FE/
├── _docker/
└── README.md

---

## 🚥 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v15+ (or Docker Desktop)

### Local Development (Manual)

#### Backend
cd be
npm install
cp .env-example .env
npm run migration:run
npm run start:dev

Backend: http://localhost:3000

#### Frontend
cd FE
npm install
npm run dev

Frontend: http://localhost:5173

### Local Development (Docker)

docker-compose -f _docker/docker-compose.dev.yml up --build

Services:
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

---

## 🏗 Architecture Overview

### Backend
- Modular Monolith using NestJS
- Feature-based modules
- Thin controllers, business logic in services
- Schema changes via migrations

### Frontend
- Single Page Application (SPA)
- REST-based communication
- Component-driven UI
- Shadcn UI components

---

## 🧠 Development Notes

- Feature-first module organization
- IMEI / Serial numbers are immutable
- Auditability is a core design concern

---

## 🔮 Future Improvements

- Role-Based Access Control (RBAC)
- Swagger / OpenAPI documentation
- Reporting dashboards
- Domain events
- CSV / Excel export

---

## 📌 License

Educational and internal use.
