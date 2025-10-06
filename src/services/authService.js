const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authService = {
 async register({ name, email, password, national_id, date_of_birth, contact_info, role, department_id }) {
 const validRoles = ['citizen', 'officer', 'department_head', 'admin'];
 if (!validRoles.includes(role)) {
 throw new Error('Invalid role');
 }

 const existingUser = await User.findByEmail(email);
 if (existingUser) {
 throw new Error('Email already exists');
 }

 const user = await User.create({
 name,
 email,
 password,
 national_id: role === 'citizen' ? national_id : null,
 date_of_birth: role === 'citizen' ? date_of_birth : null,
 contact_info: role === 'citizen' ? contact_info : null,
 role,
 department_id: role === 'officer' || role === 'department_head' ? department_id : null,
 });

 const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
 return { user, token };
 },

 async login({ email, password }) {
 const user = await User.findByEmail(email);
 if (!user || !(await bcrypt.compare(password, user.password))) {
 throw new Error('Invalid credentials');
 }

 const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
 return { user, token };
 }
};

module.exports = authService;