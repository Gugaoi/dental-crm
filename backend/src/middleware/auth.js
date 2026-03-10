const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || 'change-me-in-production';

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação ausente' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    // Attach user + clinic to request
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, clinicId: true, name: true, email: true, role: true, active: true }
    });
    if (!user || !user.active) {
      return res.status(401).json({ error: 'Usuário inativo ou não encontrado' });
    }
    req.user = user;
    req.clinicId = user.clinicId;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
