const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const patientsRoutes = require('./routes/patients');
const leadsRoutes = require('./routes/leads');
const appointmentsRoutes = require('./routes/appointments');
const prontuariosRoutes = require('./routes/prontuarios');
const staffRoutes = require('./routes/staff');
const stockRoutes = require('./routes/stock');
const paymentsRoutes = require('./routes/payments');
const dashboardRoutes = require('./routes/dashboard');
const reportsRoutes = require('./routes/reports');
const templatesRoutes = require('./routes/templates');

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date() }));

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/patients',     patientsRoutes);
app.use('/api/leads',        leadsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/prontuarios',  prontuariosRoutes);
app.use('/api/staff',        staffRoutes);
app.use('/api/stock',        stockRoutes);
app.use('/api/payments',     paymentsRoutes);
app.use('/api/dashboard',    dashboardRoutes);
app.use('/api/reports',      reportsRoutes);
app.use('/api/templates',    templatesRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🦷 DentalCRM API running on port ${PORT}`));

module.exports = app;
