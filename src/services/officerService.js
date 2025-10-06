const db = require('../config/db');
const Request = require('../models/request');
const Document = require('../models/document');
const Notification = require('../models/notification');

const officerService = {
  async getRequests(department_id) {
    const query = `
      SELECT r.*, s.name as service_name, d.name as department_name
      FROM requests r
      JOIN services s ON r.service_id = s.id
      JOIN departments d ON s.department_id = d.id
      WHERE d.id = $1
    `;
    const { rows } = await db.query(query, [department_id]);
    return rows;
  },

  async getRequestDetails(request_id) {
    const request = await Request.findById(request_id);
    const documents = await Document.findByRequestId(request_id);
    return { request, documents };
  },

  async updateRequestStatus(request_id, status, officer_id, comments) {
    const validStatuses = ['under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const request = await Request.updateStatus(request_id, status, officer_id, comments);
    await Notification.create({
      user_id: request.user_id,
      request_id: request.id,
      message: `Your request ID ${request.id} has been ${status}.`,
    });
    return request;
  },

  async getOfficers(department_id) {
    const query = `
      SELECT id, name, email, job_title
      FROM users
      WHERE role = 'officer' AND department_id = $1
    `;
    const { rows } = await db.query(query, [department_id]);
    return rows;
  },

  async assignRequest(request_id, officer_id) {
    const query = `
      UPDATE requests
      SET officer_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [officer_id, request_id]);
    if (rows.length === 0) {
      throw new Error('Request not found');
    }
    await Notification.create({
      user_id: rows[0].user_id,
      request_id,
      message: `Your request ID ${request_id} has been assigned to an officer.`,
    });
    return rows[0];
  }
};

module.exports = officerService;