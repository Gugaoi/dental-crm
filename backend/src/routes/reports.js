const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/reports/summary
router.get('/summary', async (req, res) => {
  const clinicId = req.clinicId;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalPatients, newPatientsMonth, totalLeads, leadsConverted, monthPayments, lastMonthPayments, totalAppts, cancelledAppts] = await prisma.$transaction([
    prisma.patient.count({ where: { clinicId } }),
    prisma.patient.count({ where: { clinicId, createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { clinicId } }),
    prisma.lead.count({ where: { clinicId, stage: 'ganho' } }),
    prisma.payment.aggregate({ where: { clinicId, status: 'Pago', date: { gte: monthStart } }, _sum: { value: true } }),
    prisma.payment.aggregate({ where: { clinicId, status: 'Pago', date: { gte: lastMonthStart, lt: monthStart } }, _sum: { value: true } }),
    prisma.appointment.count({ where: { clinicId, date: { gte: monthStart } } }),
    prisma.appointment.count({ where: { clinicId, date: { gte: monthStart }, status: 'cancelada' } }),
  ]);

  const conversionRate = totalLeads > 0 ? ((leadsConverted / totalLeads) * 100).toFixed(1) : 0;
  const revenueGrowth = lastMonthPayments._sum.value > 0 ? (((monthPayments._sum.value - lastMonthPayments._sum.value) / lastMonthPayments._sum.value) * 100).toFixed(1) : 0;

  res.json({
    totalPatients, newPatientsMonth,
    totalLeads, leadsConverted, conversionRate: parseFloat(conversionRate),
    monthRevenue: monthPayments._sum.value || 0,
    lastMonthRevenue: lastMonthPayments._sum.value || 0,
    revenueGrowth: parseFloat(revenueGrowth),
    totalAppts, cancelledAppts,
    cancellationRate: totalAppts > 0 ? ((cancelledAppts / totalAppts) * 100).toFixed(1) : 0
  });
});

module.exports = router;
