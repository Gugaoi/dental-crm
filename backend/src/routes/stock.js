const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/stock
router.get('/', async (req, res) => {
  const items = await prisma.stockItem.findMany({ where: { clinicId: req.clinicId }, orderBy: { name: 'asc' } });
  res.json(items);
});

// POST /api/stock
router.post('/', async (req, res) => {
  const { name, category, qty, minQty, cost, supplier } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome obrigatório' });
  const item = await prisma.stockItem.create({ data: { clinicId: req.clinicId, name, category: category || 'Outros', qty: parseInt(qty) || 0, minQty: parseInt(minQty) || 5, cost: parseFloat(cost) || 0, supplier } });
  res.status(201).json(item);
});

// PUT /api/stock/:id
router.put('/:id', async (req, res) => {
  const { name, category, qty, minQty, cost, supplier } = req.body;
  await prisma.stockItem.updateMany({ where: { id: req.params.id, clinicId: req.clinicId }, data: { name, category, qty: qty !== undefined ? parseInt(qty) : undefined, minQty: minQty !== undefined ? parseInt(minQty) : undefined, cost: cost !== undefined ? parseFloat(cost) : undefined, supplier } });
  res.json({ success: true });
});

// POST /api/stock/:id/movement
router.post('/:id/movement', async (req, res) => {
  const { type, qty } = req.body;
  if (!type || !qty) return res.status(400).json({ error: 'Tipo e quantidade obrigatórios' });
  const item = await prisma.stockItem.findFirst({ where: { id: req.params.id, clinicId: req.clinicId } });
  if (!item) return res.status(404).json({ error: 'Item não encontrado' });
  const newQty = type === 'Entrada' ? item.qty + parseInt(qty) : Math.max(0, item.qty - parseInt(qty));
  const [updated, movement] = await prisma.$transaction([
    prisma.stockItem.update({ where: { id: item.id }, data: { qty: newQty } }),
    prisma.stockMovement.create({ data: { stockItemId: item.id, userId: req.user.id, type, qty: parseInt(qty) } })
  ]);
  res.json({ item: updated, movement });
});

// GET /api/stock/movements
router.get('/movements', async (req, res) => {
  const movements = await prisma.stockMovement.findMany({
    where: { item: { clinicId: req.clinicId } },
    include: { item: { select: { name: true } }, user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(movements);
});

module.exports = router;
