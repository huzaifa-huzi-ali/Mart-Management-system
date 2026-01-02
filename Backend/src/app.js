// const express = require('express');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Food Management API is running');
// });

// const authRoutes = require('./routes/auth.routes');
// app.use('/api/auth', authRoutes);

// const foodItemRoutes = require('./routes/foodItem.routes');
// app.use('/api/food-items', foodItemRoutes);


// module.exports = app;


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
// Registering routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const foodItemRoutes = require('./routes/foodItem.routes');
const categoryRoutes = require('./routes/category.routes');
const ingredientRoutes = require('./routes/ingredient.routes');
const supplierRoutes = require('./routes/supplier.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const reportRoutes = require('./routes/report.routes');
const unitRoutes = require('./routes/unit.routes');
const stockRoutes = require('./routes/stock.routes');

// Public routes (no auth needed)
app.use('/api/auth', authRoutes);

// Protected routes (JWT + Role-based)
app.use('/api/users', userRoutes);
app.use('/api/food-items', foodItemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/unit', unitRoutes);
app.use('/api/stock', stockRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'API is running!' });
});

app.get('/api/teststock', (req, res) => {
  res.json({ status: 'OK', message: 'Stock test route' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

module.exports = app;
