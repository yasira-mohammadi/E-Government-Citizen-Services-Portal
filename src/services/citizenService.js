const Service = require('../models/service');
const Request = require('../models/request');
const Document = require('../models/document');
const Payment = require('../models/payment');
const Notification = require('../models/notification');
const User = require('../models/user');

const citizenService = {
  async getServices() {
    return await Service.findAll();
  },

  async createRequest(user_id, service_id) {
    const request = await Request.create({ user_id, service_id, status: 'submitted' });
    await Notification.create({
      user_id,
      request_id: request.id,
      message: `Your request for service ID ${service_id} has been submitted.`,
    });
    return request;
  },

 async uploadDocument(request_id, file) {
    const file_name = file.originalname;
    const file_path = `/uploads/${file.filename}`; // Store relative path
    return await Document.create({ request_id, file_name, file_path });
  },

  async makePayment(request_id, amount) {
    const payment = await Payment.create({
      request_id,
      amount,
      payment_status: 'completed',
      transaction_id: `TXN_${Date.now()}`,
    });
    await Notification.create({
      user_id: payment.request_id,
      request_id,
      message: `Payment of ${amount} for request ID ${request_id} completed.`,
    });
    return payment;
  },

  async getRequests(user_id) {
    return await Request.findByUserId(user_id);
  },

  async getNotifications(user_id) {
    return await Notification.findByUserId(user_id);
  },

  async getProfile(user_id) {
    return await User.findById(user_id);
  }
};

module.exports = citizenService;