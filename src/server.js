const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const engine = require("ejs-mate");
require('dotenv').config();

const app = express();
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const citizenRoutes = require('./routes/citizen');
const officerRoutes = require('./routes/officer');
const adminRoutes = require('./routes/admin');

app.use('/auth', authRoutes);
app.use('/citizen', citizenRoutes);
app.use('/officer', officerRoutes);
app.use('/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.render('home', { title: 'E-Government Portal' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Error', message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
