const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/patients
router.get('/', async (req, res) => {
  const { search, status } = req.query;
  const where = { clinicId: req.clinicId };
  if (status) where.status = status;
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { cpf: { contains: search } },
    { phone: { contains: search } },
  ];
  const patients = await prisma.patient.findMany({ where, orderBy: { name: 'asc' } });
  res.json(patients);
});

// GET /api/patients/:id
router.get('/:id', async (req, res) => {
  const patient = await prisma.patient.findFirst({ where: { id: req.params.id, clinicId: req.clinicId }, include: { appointments: { orderBy: { date: 'desc' }, take: 10 }, prontuarios: { orderBy: { createdAt: 'desc' }, take: 5 }, payments: { orderBy: { date: 'desc' }, take: 10 } } });
  if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' });
  res.json(patient);
});

// POST /api/patients
router.post('/', async (req, res) => {
  const { name, cpf, dob, phone, email, insurance, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome obrigatório' });
  const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ec4899','#06b6d4','#ef4444'];
  const count = await prisma.patient.count({ where: { clinicId: req.clinicId } });
  const patient = await prisma.patient.create({
    data: { clinicId: req.clinicId, name, cpf, dob: dob ? new Date(dob) : null, phone, email, insurance: insurance || 'Particular', status: status || 'Ativo', avatar: name.split(' ').map(w=>w[0]).slice(0,2).join(''), color: colors[count % colors.length] }
  });
  res.status(201).json(patient);
});

// PUT /api/patients/:id
router.put('/:id', async (req, res) => {
  const { name, cpf, dob, phone, email, insurance, status } = req.body;
  const patient = await prisma.patient.updateMany({
    where: { id: req.params.id, clinicId: req.clinicId },
    data: { name, cpf, dob: dob ? new Date(dob) : undefined, phone, email, insurance, status }
  });
  if (!patient.count) return res.status(404).json({ error: 'Paciente não encontrado' });
  res.json({ success: true });
});

// DELETE /api/patients/:id
router.delete('/:id', async (req, res) => {
  await prisma.patient.deleteMany({ where: { id: req.params.id, clinicId: req.clinicId } });
  res.json({ success: true });
});

module.exports = router;
