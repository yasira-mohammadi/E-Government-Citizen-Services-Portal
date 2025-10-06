const db = require('../config/db');

const Notification = {
  async create({ user_id, request_id, message }) {
    const query = `
      INSERT INTO notifications (user_id, request_id, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, request_id, message];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async findByUserId(user_id) {
    const query = 'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC';
    const { rows } = await db.query(query, [user_id]);
    return rows;
  }
};

module.exports = Notification;