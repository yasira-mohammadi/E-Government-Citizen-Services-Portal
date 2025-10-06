const db = require('../config/db');

const Document = {
  async create({ request_id, file_name, file_path }) {
    const query = `
      INSERT INTO documents (request_id, file_name, file_path)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [request_id, file_name, file_path];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async findByRequestId(request_id) {
    const query = 'SELECT * FROM documents WHERE request_id = $1';
    const { rows } = await db.query(query, [request_id]);
    return rows;
  }
};

module.exports = Document;