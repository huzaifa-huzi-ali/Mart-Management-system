const { poolPromise, sql } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const pool = await poolPromise;
    
    const result = await pool.request().query(`
      SELECT 
        (SELECT COUNT(*) FROM dbo.FoodItem) as totalFoodItems,
        (SELECT COUNT(*) FROM dbo.Purchase) as monthlyPurchases,
        (SELECT COUNT(*) FROM dbo.[User]) as systemUsers
    `);
    
    const stats = result.recordset[0];
    
    // Calculate stock from Stock table
    const stockResult = await pool.request().query(`
        SELECT ISNULL(SUM(quantity_available), 0) as itemsInStock
        FROM dbo.Stock
    `);
    
    stats.itemsInStock = stockResult.recordset[0].itemsInStock;

    res.json({ message: 'Stats fetched successfully', data: stats });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
