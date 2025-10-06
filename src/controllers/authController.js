const authService = require('../services/authService');

const authController = {
 getRegister(req, res) {
 res.render('auth/register', { title: 'Register' });
 },

 async register(req, res) {
 try {
 const { name, email, password, national_id, date_of_birth, contact_info, role, department_id } = req.body;
 const { user, token } = await authService.register({
 name,
 email,
 password,
 national_id,
 date_of_birth,
 contact_info,
 role,
 department_id: role === 'officer' || role === 'department_head' ? department_id : null,
 });

 req.session.token = token;
 req.session.user = { id: user.id, name: user.name, role: user.role, department_id: user.department_id };
 req.flash('success', 'Registration successful!');
 if (user.role === 'department_head') {
 res.redirect('/officer/dashboard');
 } else {
 res.redirect(`/${user.role}/dashboard`);
 }
 } catch (err) {
 req.flash('error', err.message);
 res.redirect('/auth/register');
 }
 },

 getLogin(req, res) {
 res.render('auth/login', { title: 'Login' });
 },

 async login(req, res) {
 try {
 const { email, password } = req.body;
 const { user, token } = await authService.login({ email, password });

 req.session.token = token;
 req.session.user = { id: user.id, name: user.name, role: user.role, department_id: user.department_id };
 req.flash('success', 'Login successful!');
 if (user.role === 'department_head') {
 res.redirect('/officer/dashboard');
 } else {
 res.redirect(`/${user.role}/dashboard`);
 }
 } catch (err) {
 console.error('Login error:', err);
 req.flash('error', err.message);
 res.redirect('/auth/login');
 }
 },

 logout(req, res) {
 console.log('Logout attempt:', { session: req.session });
 req.session.destroy((err) => {
 if (err) {
 console.error('Session destroy error:', err);
 req.flash('error', 'Failed to log out');
 return res.redirect('/');
 }
 req.flash('success', 'Logged out successfully');
 res.redirect('/auth/login');
 });
 }
};

module.exports = authController;