const db = require('../config/db');

class UnitService {
  async getAllUnits() {
    const result = await db.query(
      `SELECT unit_id, unit_name, conversion_rate,
              unit_name AS name,
              conversion_rate AS abbreviation
       FROM Unit
       ORDER BY unit_id`
    );
    return result.rows;
  }

  async getUnitById(id) {
    const result = await db.query(
      `SELECT unit_id, unit_name, conversion_rate,
              unit_name AS name,
              conversion_rate AS abbreviation
       FROM Unit
       WHERE unit_id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async createUnit(data) {
    const unitName = data.name ?? data.unit_name;
    const conversionRate = data.conversion_rate ?? data.abbreviation ?? null;

    const result = await db.query(
      'INSERT INTO Unit (unit_name, conversion_rate) VALUES ($1, $2) RETURNING unit_id',
      [unitName, conversionRate]
    );

    return { unit_id: result.rows[0].unit_id, name: unitName, abbreviation: conversionRate };
  }

  async updateUnit(id, data) {
    const unitName = data.name ?? data.unit_name;
    const conversionRate = data.conversion_rate ?? data.abbreviation ?? null;

    const result = await db.query(
      'UPDATE Unit SET unit_name = $1, conversion_rate = $2 WHERE unit_id = $3',
      [unitName, conversionRate, id]
    );

    return result.rowCount > 0;
  }

  async deleteUnit(id) {
    const result = await db.query('DELETE FROM Unit WHERE unit_id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new UnitService();
