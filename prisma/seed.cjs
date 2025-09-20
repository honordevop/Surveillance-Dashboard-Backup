// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const yearNum = 2025;
  const monthNum = 8;

  const year = await prisma.year.upsert({
    where: { year: yearNum },
    update: {},
    create: { year: yearNum },
  });

  let month = await prisma.month.findFirst({
    where: { month: monthNum, yearId: year.id },
  });

  if (!month) {
    month = await prisma.month.create({
      data: { month: monthNum, yearId: year.id },
    });
  }

  await prisma.monthlyIncident.upsert({
    where: { monthId: month.id },
    update: {
      illegalConnections: 7,
      illegalRefineries: 4,
      oilLeaks: 2,
      gasLeaks: 1,
      arrestsMade: 12,
      aversions: 3,
      litersAGO: 12500,
      litersPMS: 8600,
      litersCrude: 54000,
    },
    create: {
      monthId: month.id,
      illegalConnections: 7,
      illegalRefineries: 4,
      oilLeaks: 2,
      gasLeaks: 1,
      arrestsMade: 12,
      aversions: 3,
      litersAGO: 12500,
      litersPMS: 8600,
      litersCrude: 54000,
    },
  });

  // Replace any existing child rows for the month
  await prisma.illegalSite.deleteMany({ where: { monthId: month.id } });
  await prisma.burntAsset.deleteMany({ where: { monthId: month.id } });

  await prisma.illegalSite.createMany({
    data: [
      {
        monthId: month.id,
        category: 'ILLEGAL_CONNECTION',
        location: 'Water Ferry Front, Zone 6, Ogba/Egbema/Ndoni',
        lat: 5.286,
        lng: 6.694,
      },
      {
        monthId: month.id,
        category: 'ILLEGAL_REFINERY',
        location: 'Abonnema Wharf, Port Harcourt',
        lat: 4.751,
        lng: 6.988,
      },
    ],
  });

  await prisma.burntAsset.createMany({
    data: [
      { monthId: month.id, name: 'Pumping Machine', notes: 'Seized during patrol and burnt' },
      { monthId: month.id, name: 'Surface Storage Tank', notes: 'Destroyed on site' },
    ],
  });

  console.log('Seed complete for August 2025');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
