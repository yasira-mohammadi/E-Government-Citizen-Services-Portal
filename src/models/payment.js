const db = require('../config/db');

const Payment = {
  async create({ request_id, amount, payment_status, transaction_id }) {
    const query = `
      INSERT INTO payments (request_id, amount, payment_status, transaction_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [request_id, amount, payment_status, transaction_id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
};

module.exports = Payment;