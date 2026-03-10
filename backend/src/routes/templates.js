const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const templates = await prisma.messageTemplate.findMany({ where: { clinicId: req.clinicId }, orderBy: { name: 'asc' } });
  res.json(templates);
});

router.post('/', async (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) return res.status(400).json({ error: 'Nome e texto obrigatórios' });
  const tmpl = await prisma.messageTemplate.create({ data: { clinicId: req.clinicId, name, text } });
  res.status(201).json(tmpl);
});

router.put('/:id', async (req, res) => {
  const { name, text } = req.body;
  await prisma.messageTemplate.updateMany({ where: { id: req.params.id, clinicId: req.clinicId }, data: { name, text } });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  await prisma.messageTemplate.deleteMany({ where: { id: req.params.id, clinicId: req.clinicId } });
  res.json({ success: true });
});

module.exports = router;
