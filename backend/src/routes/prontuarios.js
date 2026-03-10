const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/prontuarios?patientId=xxx
router.get('/', async (req, res) => {
  const { patientId } = req.query;
  const where = { clinicId: req.clinicId };
  if (patientId) where.patientId = patientId;
  const list = await prisma.prontuario.findMany({ where, orderBy: { createdAt: 'desc' }, include: { patient: { select: { name: true } } } });
  res.json(list);
});

// GET /api/prontuarios/:id
router.get('/:id', async (req, res) => {
  const pron = await prisma.prontuario.findFirst({ where: { id: req.params.id, clinicId: req.clinicId }, include: { patient: true } });
  if (!pron) return res.status(404).json({ error: 'Prontuário não encontrado' });
  res.json(pron);
});

// POST /api/prontuarios
router.post('/', async (req, res) => {
  const { patientId, chiefComplaint, diagnosis, treatment, prescription, observations, toothStates } = req.body;
  if (!patientId) return res.status(400).json({ error: 'Paciente obrigatório' });
  const pron = await prisma.prontuario.create({
    data: { clinicId: req.clinicId, patientId, chiefComplaint, diagnosis, treatment, prescription, observations, toothStates: toothStates || {} }
  });
  res.status(201).json(pron);
});

// PUT /api/prontuarios/:id
router.put('/:id', async (req, res) => {
  const { chiefComplaint, diagnosis, treatment, prescription, observations, toothStates } = req.body;
  await prisma.prontuario.updateMany({ where: { id: req.params.id, clinicId: req.clinicId }, data: { chiefComplaint, diagnosis, treatment, prescription, observations, toothStates } });
  res.json({ success: true });
});

module.exports = router;
