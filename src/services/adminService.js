// const db = require('../config/db');

// const adminService = {
//   async createDepartment({ name, description }) {
//     const query = 'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *';
//     const { rows } = await db.query(query, [name, description]);
//     return rows[0];
//   },

//   async createService({ department_id, name, description, fee }) {
//     const query = 'INSERT INTO services (department_id, name, description, fee) VALUES ($1, $2, $3, $4) RETURNING *';
//     const { rows } = await db.query(query, [department_id, name, description, fee]);
//     return rows[0];
//   },

//   async getReports() {
//     const query = `
//       SELECT 
//         d.name as department_name,
//         COUNT(r.id) as total_requests,
//         SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END) as approved_requests,
//         SUM(CASE WHEN r.status = 'rejected' THEN 1 ELSE 0 END) as rejected_requests,
//         SUM(p.amount) as total_fees
//       FROM departments d
//       LEFT JOIN services s ON d.id = s.department_id
//       LEFT JOIN requests r ON s.id = r.service_id
//       LEFT JOIN payments p ON r.id = p.request_id
//       GROUP BY d.id, d.name
//     `;
//     const { rows } = await db.query(query);
//     return rows;
//   }
// };

// module.exports = adminService;

const db = require('../config/db');

const adminService = {
  async createDepartment({ name, description }) {
    const query = 'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *';
    const { rows } = await db.query(query, [name, description]);
    return rows[0];
  },

  async createService({ department_id, name, description, fee }) {
    const query = 'INSERT INTO services (department_id, name, description, fee) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await db.query(query, [department_id, name, description, fee]);
    return rows[0];
  },

  async getReports() {
    const query = `
      SELECT 
        d.name as department_name,
        COUNT(r.id) as total_requests,
        SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END) as approved_requests,
        SUM(CASE WHEN r.status = 'rejected' THEN 1 ELSE 0 END) as rejected_requests,
        SUM(p.amount) as total_fees
      FROM departments d
      LEFT JOIN services s ON d.id = s.department_id
      LEFT JOIN requests r ON s.id = r.service_id
      LEFT JOIN payments p ON r.id = p.request_id
      GROUP BY d.id, d.name
    `;
    const { rows } = await db.query(query);
    return rows;
  },

  async getRequests(filters = {}) {
    let query = `
      SELECT r.*, s.name AS service_name, d.name AS department_name, u.name AS citizen_name
      FROM requests r
      JOIN services s ON r.service_id = s.id
      JOIN departments d ON s.department_id = d.id
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    let params = [];
    let i = 1;

    if (filters.q) {
      query += ` AND (u.name ILIKE $${i} OR r.id::text ILIKE $${i})`;
      params.push(`%${filters.q}%`);
      i++;
    }
    if (filters.status) {
      query += ` AND r.status = $${i}`;
      params.push(filters.status);
      i++;
    }
    if (filters.department_id) {
      query += ` AND d.id = $${i}`;
      params.push(filters.department_id);
      i++;
    }
    if (filters.from) {
      query += ` AND r.created_at >= $${i}`;
      params.push(filters.from);
      i++;
    }
    if (filters.to) {
      query += ` AND r.created_at <= $${i}`;
      params.push(filters.to);
      i++;
    }

    const { rows } = await db.query(query, params);
    return rows;
  }
};

module.exports = adminService;
