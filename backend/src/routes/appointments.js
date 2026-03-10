const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/appointments?date=2026-03-10
router.get('/', async (req, res) => {
  const { date, patientId } = req.query;
  const where = { clinicId: req.clinicId };
  if (patientId) where.patientId = patientId;
  if (date) {
    const d = new Date(date);
    const next = new Date(d); next.setDate(d.getDate() + 1);
    where.date = { gte: d, lt: next };
  }
  const appts = await prisma.appointment.findMany({ where, include: { patient: { select: { name: true, phone: true } }, user: { select: { name: true } } }, orderBy: [{ date: 'asc' }, { time: 'asc' }] });
  res.json(appts);
});

// POST /api/appointments
router.post('/', async (req, res) => {
  const { patientId, userId, procedure, date, time, status, notes, color } = req.body;
  if (!patientId || !procedure || !date || !time) return res.status(400).json({ error: 'Paciente, procedimento, data e hora obrigatórios' });
  const appt = await prisma.appointment.create({
    data: { clinicId: req.clinicId, patientId, userId: userId || req.user.id, procedure, date: new Date(date), time, status: status || 'agendada', notes, color: color || '#3b82f6' },
    include: { patient: { select: { name: true } } }
  });
  res.status(201).json(appt);
});

// PUT /api/appointments/:id
router.put('/:id', async (req, res) => {
  const { procedure, date, time, status, notes, color } = req.body;
  await prisma.appointment.updateMany({ where: { id: req.params.id, clinicId: req.clinicId }, data: { procedure, date: date ? new Date(date) : undefined, time, status, notes, color } });
  res.json({ success: true });
});

// DELETE /api/appointments/:id
router.delete('/:id', async (req, res) => {
  await prisma.appointment.deleteMany({ where: { id: req.params.id, clinicId: req.clinicId } });
  res.json({ success: true });
});

module.exports = router;
