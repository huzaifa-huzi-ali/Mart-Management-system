const { poolPromise, sql } = require('../config/db');

class UnitService {
  async getAllUnits() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Unit');
    return result.recordset;
  }

  async getUnitById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM dbo.Unit WHERE unit_id=@id');
    return result.recordset[0];
  }

  async createUnit(data) {
    const { name, abbreviation } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar(100), name)
      .input('abbreviation', sql.VarChar(10), abbreviation || null)
      .query(`INSERT INTO dbo.Unit (name, abbreviation) VALUES (@name, @abbreviation);
              SELECT SCOPE_IDENTITY() AS unit_id;`);
    return { unit_id: result.recordset[0].unit_id, name, abbreviation };
  }

  async updateUnit(id, data) {
    const { name, abbreviation } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar(100), name)
      .input('abbreviation', sql.VarChar(10), abbreviation || null)
      .query('UPDATE dbo.Unit SET name=@name, abbreviation=@abbreviation WHERE unit_id=@id');
    return result.rowsAffected[0] > 0;
  }

  async deleteUnit(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.Unit WHERE unit_id=@id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = new UnitService();
