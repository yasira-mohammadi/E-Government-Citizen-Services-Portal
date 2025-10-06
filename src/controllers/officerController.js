const officerService = require('../services/officerService');

const officerController = {
  async getDashboard(req, res) {
    try {
      const requests = await officerService.getRequests(req.user.department_id);
      if (req.user.role === 'department_head') {
        const officers = await officerService.getOfficers(req.user.department_id);
        res.render('officer/department_head_dashboard', { title: 'Department Head Dashboard', requests, officers });
      } else {
        res.render('officer/dashboard', { title: 'Officer Dashboard', requests });
      }
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/');
    }
  },

  async getRequestDetails(req, res) {
    try {
      const { request, documents } = await officerService.getRequestDetails(req.params.id);
      res.render('officer/request', { title: 'Request Details', request, documents });
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/officer/dashboard');
    }
  },

  async updateRequestStatus(req, res) {
    try {
      const { status, comments } = req.body;
      await officerService.updateRequestStatus(req.params.id, status, req.user.id, comments);
      req.flash('success', 'Request updated successfully');
      res.redirect('/officer/dashboard');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect(`/officer/requests/${req.params.id}`);
    }
  },

  async assignRequest(req, res) {
    try {
      const { request_id } = req.params;
      const { officer_id } = req.body;
      await officerService.assignRequest(request_id, officer_id);
      req.flash('success', 'Request assigned successfully');
      res.redirect('/officer/dashboard');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/officer/dashboard');
    }
  }
};

module.exports = officerController;