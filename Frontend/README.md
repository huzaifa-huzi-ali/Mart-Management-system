# Food Management System - Frontend

## Overview
The Frontend is a React-based single-page application (SPA) built with Vite. It provides a user-friendly interface for managing all aspects of the Food Management System, consuming the RESTful API provided by the Backend. It implements Role-Based Access Control (RBAC) to dynamically adjust the UI based on user permissions.

## Technologies & Dependencies
-   **Framework**: React.js
-   **Build Tool**: Vite
-   **HTTP Client**: Axios (for API requests)
-   **Routing**: React Router DOM (`react-router-dom`)
-   **Icons**: React Icons (`react-icons`)
-   **Styling**: CSS Modules / Standard CSS

## Project Structure
```
Frontend/
├── src/
│   ├── api/            # Axios instance configuration (Base URL, Interceptors)
│   ├── components/     # Reusable UI components (Sidebar, etc.)
│   ├── pages/          # Application Views/Screens
│   ├── services/       # API integration modules (Service Layer)
│   ├── styles/         # Global and Component styles
│   ├── App.jsx         # Main App Component and Route definitions
│   └── main.jsx        # Entry point
├── public/             # Static assets
└── package.json        # Dependencies
```

## Functionalities
The application is organized into modules accessible via the Sidebar, filtered by user role.

### 1. Dashboard
-   **Visual Overview**: Displays key statistics like Total Food Items, Items in Stock, Monthly Purchases, and System Users.
-   **Integration**: Fetches data from `/api/reports/dashboard-stats`.

### 2. User Management
-   **Users Page**: List, Add, Edit, and Delete system users.
-   **Access**: Admin & Manager only.
-   **Search**: Filter users by Name or ID.

### 3. Food & Menu
-   **Food Items**: Manage menu items, prices, descriptions, and link them to Categories and Ingredients.
    -   **RBAC**: Read-only for Waiter/Staff/Marketing/Supplier. CRUD for Admin/Manager/Chef/Cashier.
    -   **Search**: Filter by Name or ID.
-   **Categories**: Organize food items. (Admin/Manager/Chef).
-   **Ingredients**: Manage raw materials used in recipes. (Admin/Manager/Chef).
-   **Units**: Define measurement units. (Admin/Manager/Chef).

### 4. Inventory & Stock
-   **Stock**: View and manage current stock levels of *Ingredients*.
    -   **Logic**: Stock is tracked by Ingredient ID.
    -   **Search**: Filter by Ingredient Name or Stock ID.
-   **Inventory Logs**: Track detailed history of stock movements (IN/OUT).
    -   **Features**: Displays Ingredient Name and User who performed action. Supports manual logging.
-   **Purchases**: Record supplier purchases of ingredients. Automatically increases Stock.

### 5. Operations
-   **Orders**: Create and manage customer orders.
    -   **Automation**: Placing an order automatically deducts the required ingredients from Stock based on the Food Item's recipe.
    -   **Sorting**: Most recent orders appear first.
-   **Suppliers**: Manage vendor database. (Admin/Manager/Inventory/Supplier Relations).
-   **Payments**: Track payments linked to Orders. (Admin/Manager/Cashier).

## Integration
-   **API Communication**: All services in `src/services/` import the configured Axios instance from `src/api/api.js`.
-   **Authentication**: JWT token is stored in `localStorage` and attached to requests.
-   **RBAC**: The `Sidebar` component hides links based on user roles (`user.roles` from local storage). Pages like `FoodItems` disable buttons for unauthorized roles.

## Setup & Run
1.  Install dependencies: `npm install`.
2.  Start development server: `npm run dev`.
3.  Access application at `http://localhost:5173`.
