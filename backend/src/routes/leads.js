const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/leads?stage=novo
router.get('/', async (req, res) => {
  const { stage } = req.query;
  const where = { clinicId: req.clinicId };
  if (stage) where.stage = stage;
  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(leads);
});

// GET /api/leads/:id
router.get('/:id', async (req, res) => {
  const lead = await prisma.lead.findFirst({ where: { id: req.params.id, clinicId: req.clinicId } });
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });
  res.json(lead);
});

// POST /api/leads
router.post('/', async (req, res) => {
  const { name, phone, email, interest, source, stage, value, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome obrigatório' });
  const lead = await prisma.lead.create({
    data: { clinicId: req.clinicId, name, phone, email, interest, source: source || 'Outros', stage: stage || 'novo', value: value ? parseFloat(value) : null, notes }
  });
  res.status(201).json(lead);
});

// PUT /api/leads/:id  (also used for stage changes)
router.put('/:id', async (req, res) => {
  const { name, phone, email, interest, source, stage, value, notes } = req.body;
  const result = await prisma.lead.updateMany({
    where: { id: req.params.id, clinicId: req.clinicId },
    data: { name, phone, email, interest, source, stage, value: value ? parseFloat(value) : undefined, notes }
  });
  if (!result.count) return res.status(404).json({ error: 'Lead não encontrado' });
  const updated = await prisma.lead.findUnique({ where: { id: req.params.id } });
  res.json(updated);
});

// DELETE /api/leads/:id
router.delete('/:id', async (req, res) => {
  await prisma.lead.deleteMany({ where: { id: req.params.id, clinicId: req.clinicId } });
  res.json({ success: true });
});

// POST /api/leads/:id/convert  — convert lead to patient
router.post('/:id/convert', async (req, res) => {
  const lead = await prisma.lead.findFirst({ where: { id: req.params.id, clinicId: req.clinicId } });
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });
  const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ec4899','#06b6d4'];
  const count = await prisma.patient.count({ where: { clinicId: req.clinicId } });
  const patient = await prisma.patient.create({
    data: { clinicId: req.clinicId, name: lead.name, phone: lead.phone, email: lead.email, status: 'Ativo', avatar: lead.name.split(' ').map(w=>w[0]).slice(0,2).join(''), color: colors[count % colors.length] }
  });
  await prisma.lead.update({ where: { id: lead.id }, data: { stage: 'ganho' } });
  res.json({ patient, message: 'Lead convertido em paciente com sucesso' });
});

module.exports = router;
