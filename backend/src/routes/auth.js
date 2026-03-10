const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// POST /api/auth/register - create clinic + first admin user
router.post('/register', async (req, res) => {
  const { clinicName, name, email, password } = req.body;
  if (!clinicName || !name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const slug = clinicName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const existing = await prisma.clinic.findUnique({ where: { slug } });
  if (existing) return res.status(409).json({ error: 'Clínica já cadastrada' });

  const hashed = await bcrypt.hash(password, 10);
  const clinic = await prisma.clinic.create({
    data: {
      name: clinicName,
      slug,
      users: { create: { name, email, password: hashed, role: 'admin' } }
    },
    include: { users: true }
  });

  const user = clinic.users[0];
  const token = jwt.sign({ userId: user.id, clinicId: clinic.id }, SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign({ userId: user.id }, SECRET + 'refresh', { expiresIn: '7d' });

  res.status(201).json({ token, refresh, user: { id: user.id, name: user.name, email: user.email, role: user.role, clinicId: clinic.id, clinicName: clinic.name } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password, clinicSlug } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });

  const whereClause = clinicSlug
    ? { email, clinicId: (await prisma.clinic.findUnique({ where: { slug: clinicSlug } }))?.id }
    : { email };

  const user = await prisma.user.findFirst({
    where: whereClause,
    include: { clinic: { select: { id: true, name: true, slug: true, plan: true } } }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  if (!user.active) return res.status(403).json({ error: 'Usuário inativo' });

  const token = jwt.sign({ userId: user.id, clinicId: user.clinicId }, SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign({ userId: user.id }, SECRET + 'refresh', { expiresIn: '7d' });

  res.json({ token, refresh, user: { id: user.id, name: user.name, email: user.email, role: user.role, clinicId: user.clinicId, clinicName: user.clinic.name } });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refresh } = req.body;
  if (!refresh) return res.status(400).json({ error: 'Token de refresh obrigatório' });
  try {
    const payload = jwt.verify(refresh, SECRET + 'refresh');
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.active) return res.status(401).json({ error: 'Usuário inválido' });
    const token = jwt.sign({ userId: user.id, clinicId: user.clinicId }, SECRET, { expiresIn: '15m' });
    res.json({ token });
  } catch {
    res.status(401).json({ error: 'Refresh token inválido' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Não autenticado' });
  try {
    const payload = jwt.verify(header.split(' ')[1], SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { clinic: { select: { name: true, slug: true, plan: true } } }
    });
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = router;
