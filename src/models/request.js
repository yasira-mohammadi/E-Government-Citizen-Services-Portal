const db = require('../config/db');

const Request = {
  async create({ user_id, service_id, status }) {
    const query = `
      INSERT INTO requests (user_id, service_id, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, service_id, status];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async findByUserId(user_id) {
    const query = `
      SELECT r.*, s.name as service_name, d.name as department_name
      FROM requests r
      JOIN services s ON r.service_id = s.id
      JOIN departments d ON s.department_id = d.id
      WHERE r.user_id = $1
    `;
    const { rows } = await db.query(query, [user_id]);
    return rows;
  },

  async findById(id) {
    const query = `
      SELECT r.*, s.name as service_name, d.name as department_name
      FROM requests r
      JOIN services s ON r.service_id = s.id
      JOIN departments d ON s.department_id = d.id
      WHERE r.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  async updateStatus(id, status, officer_id, comments) {
    const query = `
      UPDATE requests
      SET status = $1, officer_id = $2, comments = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const values = [status, officer_id, comments, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
};

module.exports = Request;