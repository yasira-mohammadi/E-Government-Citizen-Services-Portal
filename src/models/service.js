const db = require('../config/db');

const Service = {
  async findAll() {
    const query = 'SELECT * FROM services';
    const { rows } = await db.query(query);
    return rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM services WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
};

module.exports = Service;