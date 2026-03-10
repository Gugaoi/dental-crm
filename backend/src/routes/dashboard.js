const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/dashboard — all KPIs in one call
router.get('/', async (req, res) => {
  const clinicId = req.clinicId;
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    patientsToday,
    activePatients,
    activeLeads,
    pendingAppts,
    monthRevenue,
    upcomingAppts,
    recentLeads,
    lowStock
  ] = await prisma.$transaction([
    prisma.appointment.count({ where: { clinicId, date: { gte: today, lt: tomorrow }, status: { not: 'cancelada' } } }),
    prisma.patient.count({ where: { clinicId, status: 'Ativo' } }),
    prisma.lead.count({ where: { clinicId, stage: { notIn: ['ganho','perdido'] } } }),
    prisma.appointment.count({ where: { clinicId, status: 'agendada' } }),
    prisma.payment.aggregate({ where: { clinicId, status: 'Pago', date: { gte: monthStart } }, _sum: { value: true } }),
    prisma.appointment.findMany({ where: { clinicId, date: { gte: today }, status: { not: 'cancelada' } }, include: { patient: { select: { name: true } } }, orderBy: [{ date: 'asc' },{ time: 'asc' }], take: 5 }),
    prisma.lead.findMany({ where: { clinicId }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.stockItem.findMany({ where: { clinicId }, select: { id: true, name: true, qty: true, minQty: true } })
  ]);

  res.json({
    kpis: {
      patientsToday,
      activePatients,
      activeLeads,
      pendingAppts,
      monthRevenue: monthRevenue._sum.value || 0
    },
    upcomingAppts,
    recentLeads,
    lowStock: lowStock.filter(i => i.qty <= i.minQty)
  });
});

module.exports = router;
