const { poolPromise, sql } = require('../config/db');

class FoodItemService {
  async getAllFoodItems() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        f.food_item_id, 
        f.name, 
        f.price, 
        f.description,
        MAX(c.category_id) AS category_id,
        MAX(c.name) AS category_name,
        STRING_AGG(CAST(i.ingredient_id AS VARCHAR), ',') AS ingredient_ids_str,
        STRING_AGG(i.name, ', ') AS ingredients
      FROM dbo.FoodItem f
      LEFT JOIN dbo.FoodItemCategory fic ON f.food_item_id = fic.food_item_id
      LEFT JOIN dbo.Category c ON fic.category_id = c.category_id
      LEFT JOIN dbo.FoodItemIngredient fii ON f.food_item_id = fii.food_item_id
      LEFT JOIN dbo.Ingredient i ON fii.ingredient_id = i.ingredient_id
      GROUP BY f.food_item_id, f.name, f.price, f.description
    `);
    return result.recordset;
  }

  async getFoodItemById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT food_item_id, name, price, description FROM dbo.FoodItem WHERE food_item_id=@id');
    return result.recordset[0];
  }

  async createFoodItem(data) {
    const { name, price, description, category_id, ingredient_ids } = data;
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        const request = new sql.Request(transaction);
        const result = await request
          .input('name', sql.VarChar(150), name)
          .input('price', sql.Decimal(10, 2), price)
          .input('description', sql.VarChar(255), description || null)
          .query(`INSERT INTO dbo.FoodItem (name, price, description) VALUES (@name, @price, @description);
                  SELECT SCOPE_IDENTITY() AS food_item_id;`);
        
        const foodItemId = result.recordset[0].food_item_id;

        if (category_id) {
            const req2 = new sql.Request(transaction);
            await req2.query(`INSERT INTO dbo.FoodItemCategory (food_item_id, category_id) VALUES (${foodItemId}, ${category_id})`);
        }

        if (ingredient_ids && ingredient_ids.length > 0) {
            const uniqueIngIds = [...new Set(ingredient_ids)];
            for (const ingId of uniqueIngIds) {
                const reqIng = new sql.Request(transaction);
                // Default quantity_required to 1 as it is mandatory but not provided by frontend
                await reqIng.query(`INSERT INTO dbo.FoodItemIngredient (food_item_id, ingredient_id, quantity_required) VALUES (${foodItemId}, ${ingId}, 1)`);
            }
        }

        await transaction.commit();
        return { food_item_id: foodItemId, name, price, description };
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
  }

  async updateFoodItem(id, data) {
    const { name, price, description, category_id, ingredient_ids } = data;
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        const request = new sql.Request(transaction);
        await request
          .input('id', sql.Int, id)
          .input('name', sql.VarChar(150), name)
          .input('price', sql.Decimal(10, 2), price)
          .input('description', sql.VarChar(255), description || null)
          .query('UPDATE dbo.FoodItem SET name=@name, price=@price, description=@description WHERE food_item_id=@id');
        
        // Update Category
        if (category_id !== undefined) { // If provided
            const reqDelCat = new sql.Request(transaction);
            await reqDelCat.query(`DELETE FROM dbo.FoodItemCategory WHERE food_item_id=${id}`);
            
            if (category_id) {
                const reqInsCat = new sql.Request(transaction);
                await reqInsCat.query(`INSERT INTO dbo.FoodItemCategory (food_item_id, category_id) VALUES (${id}, ${category_id})`);
            }
        }

        // Update Ingredients
        if (ingredient_ids !== undefined) {
            const reqDelIng = new sql.Request(transaction);
            await reqDelIng.query(`DELETE FROM dbo.FoodItemIngredient WHERE food_item_id=${id}`);
            
            if (ingredient_ids.length > 0) {
                const uniqueIngIds = [...new Set(ingredient_ids)];
                for (const ingId of uniqueIngIds) {
                    const reqInsIng = new sql.Request(transaction);
                    // Default quantity_required to 1
                    await reqInsIng.query(`INSERT INTO dbo.FoodItemIngredient (food_item_id, ingredient_id, quantity_required) VALUES (${id}, ${ingId}, 1)`);
                }
            }
        }

        await transaction.commit();
        return true;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
  }

  async deleteFoodItem(id) {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      const request = new sql.Request(transaction);
      request.input('id', sql.Int, id);

      await request.query('DELETE FROM dbo.ItemUnit WHERE food_item_id=@id');
      await request.query('DELETE FROM dbo.InventoryLog WHERE food_item_id=@id');
      await request.query('DELETE FROM dbo.FoodItemCategory WHERE food_item_id=@id');
      await request.query('DELETE FROM dbo.FoodItemIngredient WHERE food_item_id=@id');
      await request.query('DELETE FROM dbo.FoodItemSupplier WHERE food_item_id=@id');
      await request.query('DELETE FROM dbo.PurchaseItem WHERE food_item_id=@id');
      await request.query('DELETE FROM dbo.Stock WHERE food_item_id=@id');
      await request.query('DELETE FROM dbo.OrderItem WHERE food_item_id=@id');
      
      const result = await request.query('DELETE FROM dbo.FoodItem WHERE food_item_id=@id');

      if (result.rowsAffected[0] === 0) {
        await transaction.rollback();
        return false;
      }

      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = new FoodItemService();
