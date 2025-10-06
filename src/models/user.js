const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create({ name, email, password, national_id, date_of_birth, contact_info, role, department_id, job_title }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (name, email, password, national_id, date_of_birth, contact_info, role, department_id, job_title)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, name, email, role, department_id
    `;
    const values = [name, email, hashedPassword, national_id, date_of_birth, contact_info, role, department_id, job_title];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
  },

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
};

module.exports = User;