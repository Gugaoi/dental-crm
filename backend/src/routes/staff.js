const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const staff = await prisma.staff.findMany({ where: { clinicId: req.clinicId }, orderBy: { name: 'asc' } });
  res.json(staff);
});

router.post('/', async (req, res) => {
  const { name, role, email, phone, salary, schedule, status } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'Nome e cargo obrigatórios' });
  const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ec4899','#06b6d4'];
  const count = await prisma.staff.count({ where: { clinicId: req.clinicId } });
  const s = await prisma.staff.create({ data: { clinicId: req.clinicId, name, role, email, phone, salary: salary ? parseFloat(salary) : 0, schedule, status: status || 'Ativo', avatar: name.split(' ').map(w=>w[0]).slice(0,2).join(''), color: colors[count % colors.length] } });
  res.status(201).json(s);
});

router.put('/:id', async (req, res) => {
  const { name, role, email, phone, salary, schedule, status } = req.body;
  await prisma.staff.updateMany({ where: { id: req.params.id, clinicId: req.clinicId }, data: { name, role, email, phone, salary: salary ? parseFloat(salary) : undefined, schedule, status } });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  await prisma.staff.deleteMany({ where: { id: req.params.id, clinicId: req.clinicId } });
  res.json({ success: true });
});

module.exports = router;
