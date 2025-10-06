const citizenService = require('../services/citizenService');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed!'));
  }
});  

const citizenController = {
  async getDashboard(req, res) {
    try {
      const requests = await citizenService.getRequests(req.user.id);
      const notifications = await citizenService.getNotifications(req.user.id);
      res.render('citizen/dashboard', { title: 'Citizen Dashboard', requests, notifications });
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/');
    }
  },

  async getRequests(req, res) {
    try {
      const requests = await citizenService.getRequests(req.user.id);
      res.render('citizen/requests', { title: 'My Requests', requests });
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/citizen/dashboard');
    }
  },

  async getSubmit(req, res) {
    try {
      const services = await citizenService.getServices();
      res.render('citizen/submit', { title: 'Submit Request', services });
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/citizen/dashboard');
    }
  },

  async createRequest(req, res) {
    try {
      const { service_id } = req.body;
      await citizenService.createRequest(req.user.id, service_id);
      req.flash('success', 'Request submitted successfully');
      res.redirect('/citizen/requests');
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/citizen/submit');
    }
  },

  async uploadDocument(req, res) {
    try {
      await new Promise((resolve, reject) => {
        upload.single('document')(req, res, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      const { request_id } = req.params;
      await citizenService.uploadDocument(request_id, req.file);
      req.flash('success', 'Document uploaded successfully');
      res.redirect('/citizen/requests');
    } catch (err) {
      req.flash('error', err.message || 'Server error');
      res.redirect('/citizen/requests');
    }
  },
   async payRequest(req, res) {
  try {
    const { request_id } = req.params;
    const { amount } = req.body;

    await citizenService.makePayment(request_id, amount);

    req.flash("success", "Payment successful");
    res.render("citizen/payment_success", { title: "Payment Success" });
  } catch (err) {
    req.flash("error", "Payment failed");
    res.redirect("/citizen/requests");
  }
},
  async getProfile(req, res) {
    try {
      const user = await citizenService.getProfile(req.user.id);
      res.render('citizen/profile', { title: 'Profile', user });
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/citizen/dashboard');
    }
  }
};

module.exports = citizenController;
