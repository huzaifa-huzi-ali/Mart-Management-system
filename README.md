# 🍽️ Food Management System
A full-stack application for food business management/Mart-system with **Role-Based Access Control (RBAC)**, **real-time inventory tracking**, and **automated stock management**.

# ✨ Features
- Dashboard with key metrics (Food Items, Stock, Purchases, Users)
- Complete RBAC  (9 roles: Admin, Manager, Chef, Cashier, etc.)
- Automated Inventory (Orders deduct stock, Purchases add stock)
- Order Management with recipe-based stock deduction
- Supplier & Purchase Tracking
- User Management with role assignments
- Responsive UI with modern React + Vite

# 🏗️ Tech Stack
Frontend: React + Vite + Axios + React Router
Backend: Node.js + Express + MSSQL + JWT
Database: Microsoft SQL Server


# 🎯 Project Flow
<img width="4239" height="4446" alt="image" src="https://github.com/user-attachments/assets/3262c683-6bcc-4b79-bc46-0581b779e0ed" />


# 📁 Repository Structure

food-management-system/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── api/            # Axios config
│   │   ├── components/     # Reusable UI
│   │   ├── pages/          # Views (Dashboard, Orders, etc.)
│   │   ├── services/       # API calls
│   │   └── App.jsx         # Routes + RBAC
│   ├── public/
│   └── package.json
│
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/         # DB + Env
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # JWT + RBAC
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── README.md

# 🚀 Quick Start
  Prerequisites
  Node.js 18+
  npm/yarn
  SQL Server (local or cloud)
# 1. Clone & Install
  bash
  git clone <your-repo-url>
  cd food-management-system
# 2. Backend Setup
  bash
  cd backend
  cp .env.example .env
  Update .env with DB credentials
  npm install
  npm run dev  # or npm start  
Backend runs on: http://localhost:5000  

# 3. Frontend Setup
  bash
  cd ../frontend
  npm install
  npm run dev
Frontend runs on: http://localhost:5173

# 4. Environment Variables
  Backend .env:
  DB_HOST=localhost
  DB_USER=sa
  DB_PASSWORD=yourpassword
  DB_NAME=food_management
  JWT_SECRET=your-super-secret-key
  PORT=5000

# 🔗 API Integration
Update frontend src/api/api.js baseURL:
const API_BASE_URL = 'http://localhost:5000/api';


# 🎮 Role Permissions
| Role      | Dashboard   | Users  | Food/Menu  | Stock   | Orders  |  Suppliers  | Payments  |
| --------- | ---------   | -----  | ---------  | -----   | ------  | ---------   | --------  |
| Admin     | ✅         | ✅     | ✅         | ✅     | ✅      | ✅         | ✅        |
| Manager   | ✅         | ✅     | ✅         | ✅     | ✅      | ✅         | ✅        |
| Chef      | ✅         | ❌     | ✅         | 🔒     | ❌      | ❌         | ❌        |
| Cashier   | ✅         | ❌     | 🔒         | ❌     | ✅      | ❌         | ✅        |
| Inventory | ✅         | ❌     | ❌         | ✅     | ❌      | ✅         | ❌        |

# 🛠️ Development Scripts
# Frontend:
          npm run dev      # Development server
          npm run build    # Production build
          npm run preview  # Preview production build      
# Backend:
          npm run dev      # Nodemon development
          npm start        # Production server
  
# 🤝 Contributing
Fork the repository
Create feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add some AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open Pull Request

# 📄 License
This project is open source and available under the MIT License.

# 👥 Roles Team
Admin/Manager: Full system control
Chef: Menu & recipe management
Cashier: Order & payment processing
Inventory Control: Stock operations
Waiter/Staff: Order viewing

# ⭐ Star us on GitHub if this helps your food business!
This README includes:
- ✅ Visual flow diagrams (Mermaid)
- ✅ Clear setup instructions
- ✅ Project architecture overview
- ✅ Role-based permissions table
- ✅ Screenshots placeholders
- ✅ Quick start commands
- ✅ Environment setup
- ✅ API integration guide

# Would you like me to adjust any section, add specific screenshots, or customize the styling further?
