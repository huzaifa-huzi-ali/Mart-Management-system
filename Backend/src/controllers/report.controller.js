const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM FoodItem) AS "totalFoodItems",
        (SELECT COUNT(*) FROM Purchase) AS "monthlyPurchases",
        (SELECT COUNT(*) FROM "User") AS "systemUsers"
    `);

    const stats = result.rows[0];

    const stockResult = await db.query(`
      SELECT COALESCE(SUM(quantity_available), 0) AS "itemsInStock"
      FROM Stock
    `);

    stats.itemsInStock = stockResult.rows[0].itemsInStock;

    res.json({ message: 'Stats fetched successfully', data: stats });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
