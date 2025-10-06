// const adminService = require('../services/adminService');

// const adminController = {
//   async getDashboard(req, res) {
//     try {
//       const reports = await adminService.getReports();
//       res.render('admin/dashboard', { title: 'Admin Dashboard', reports });
//     } catch (err) {
//       req.flash('error', 'Server error');
//       res.redirect('/');
//     }
//   },

//   async createDepartment(req, res) {
//     try {
//       const { name, description } = req.body;
//       await adminService.createDepartment({ name, description });
//       req.flash('success', 'Department created successfully');
//       res.redirect('/admin/dashboard');
//     } catch (err) {
//       req.flash('error', 'Server error');
//       res.redirect('/admin/dashboard');
//     }
//   },

//   async createService(req, res) {
//     try {
//       const { department_id, name, description, fee } = req.body;
//       await adminService.createService({ department_id, name, description, fee });
//       req.flash('success', 'Service created successfully');
//       res.redirect('/admin/dashboard');
//     } catch (err) {
//       req.flash('error', 'Server error');
//       res.redirect('/admin/dashboard');
//     }
//   }
// };
// module.exports = adminController;

const adminService = require('../services/adminService');

const adminController = {
  async getDashboard(req, res) {
    try {
      const reports = await adminService.getReports();
      res.render('admin/dashboard', { title: 'Admin Dashboard', reports });
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/');
    }
  },

  async createDepartment(req, res) {
    try {
      const { name, description } = req.body;
      await adminService.createDepartment({ name, description });
      req.flash('success', 'Department created successfully');
      res.redirect('/admin/dashboard');
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/admin/dashboard');
    }
  },

  async createService(req, res) {
    try {
      const { department_id, name, description, fee } = req.body;
      await adminService.createService({ department_id, name, description, fee });
      req.flash('success', 'Service created successfully');
      res.redirect('/admin/dashboard');
    } catch (err) {
      req.flash('error', 'Server error');
      res.redirect('/admin/dashboard');
    }
  },

  async getReports(req, res) {
    try {
      const stats = await adminService.getReports();
      res.render("admin/reports", { title: "Reports", stats });
    } catch (err) {
      req.flash("error", "Error loading reports");
      res.redirect("/admin/dashboard");
    }
  }
};

module.exports = adminController;
