# Food Management System - Backend

## Overview
The Backend serves as the RESTful API for the Food Management System, handling data persistence, authentication, and business logic. It connects to a SQL Server database. It implements a layered architecture (Controller-Service-Repository) for maintainability.

## Technologies & Dependencies
-   **Runtime**: Node.js
-   **Framework**: Express.js (`express`)
-   **Database Driver**: `mssql` (Microsoft SQL Server)
-   **Authentication**: `jsonwebtoken` (JWT), `bcryptjs` (Password Hashing)
-   **Utilities**: `dotenv` (Environment variables), `cors` (Cross-Origin Resource Sharing), `body-parser`

## Project Structure
```
Backend/
├── src/
│   ├── config/         # Database and Environment configuration
│   ├── controllers/    # Request handlers (Input validation, Response formatting)
│   ├── middlewares/    # Auth (JWT) and Role (RBAC) verification
│   ├── routes/         # API Route definitions and middleware application
│   ├── services/       # Business Logic and Database Interaction
│   ├── utils/          # Helper functions
│   ├── app.js          # Express App setup
│   └── server.js       # Application Entry Point
├── .env                # Environment Variables
└── package.json        # Dependencies
```

## Functionalities & API Endpoints
The API is prefixed with `/api`. All routes except `/auth` require authentication.

### 1. Authentication
-   `POST /api/auth/login`: Authenticates user and returns JWT token.

### 2. User Management (Admin/Manager)
-   `CRUD /api/users`: Manage system users and their roles.

### 3. Food & Menu
-   `CRUD /api/food-items`: Manage menu items. Includes complex logic to link Categories and Ingredients.
-   `CRUD /api/categories`: Manage food categories.
-   `CRUD /api/ingredients`: Manage raw ingredients.

### 4. Inventory & Stock
-   `CRUD /api/stock`: Manage ingredient stock levels.
    -   **Automation**: Deducts stock when Orders are placed. Adds stock when Purchases are made.
-   `CRUD /api/inventory`: Inventory Logs for tracking stock history.
-   `CRUD /api/unit`: Measurement units.

### 5. Business Operations
-   `CRUD /api/orders`: Manage customer orders.
    -   **Trigger**: Creating an order automatically deducts ingredients from stock based on the recipe.
-   `CRUD /api/purchases`: Record supplier purchases.
    -   **Trigger**: Creating a purchase automatically adds ingredients to stock.
-   `CRUD /api/suppliers`: Manage vendor information.
-   `CRUD /api/payments`: Track payments linked to orders.

### 6. Reports
-   `GET /api/reports/dashboard-stats`: Aggregated system statistics.

## Security (RBAC)
The system uses `roleMiddleware` to restrict access.
-   **Roles**: Admin, Manager, Chef, Cashier, Inventory Control, Supplier Relations, Marketing, Waiter, Staff.
-   **Permissions**:
    -   **Admin/Manager**: Full access.
    -   **Chef**: Food Items, Ingredients, Categories (Write).
    -   **Cashier**: Orders, Payments (Write).
    -   **Inventory Control**: Stock, Purchases, Inventory Logs (Write).
    -   **Supplier Relations**: Suppliers (Write).
    -   **Marketing/Staff/Waiter**: Read-only access to relevant modules (e.g., Food Items).

## Integration
-   **Database**: Uses `mssql` connection pool. Logic is encapsulated in `Service` classes to handle transactions and complex queries (e.g., cascading deletes).
-   **Cascading Deletes**: Deleting a parent entity (e.g., Supplier) automatically removes dependent records (e.g., Purchases) to ensure data integrity.

## Setup & Run
1.  Configure database credentials in `.env`.
2.  Install dependencies: `npm install`.
3.  Start server: `node src/server.js` (or `npm start` / `nodemon` for development).
