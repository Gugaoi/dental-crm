const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const payments = await prisma.payment.findMany({ where: { clinicId: req.clinicId }, include: { patient: { select: { name: true } } }, orderBy: { date: 'desc' } });
  res.json(payments);
});

router.post('/', async (req, res) => {
  const { patientId, procedure, value, method, status, date } = req.body;
  if (!value) return res.status(400).json({ error: 'Valor obrigatório' });
  const payment = await prisma.payment.create({ data: { clinicId: req.clinicId, patientId, procedure, value: parseFloat(value), method, status: status || 'Pendente', date: date ? new Date(date) : new Date() } });
  res.status(201).json(payment);
});

router.put('/:id', async (req, res) => {
  const { status, method, invoiceId } = req.body;
  await prisma.payment.updateMany({ where: { id: req.params.id, clinicId: req.clinicId }, data: { status, method, invoiceId } });
  res.json({ success: true });
});

module.exports = router;
