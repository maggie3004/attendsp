/**
 * Prisma Seed Script
 * Creates demo data: admin user, sites, workers
 * Run: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding AttendSP database...')

  // ── Global Settings ───────────────────────────────────────
  const settings = await prisma.globalSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      companyName: 'AttendSP Demo Company',
      defaultStartTime: '09:00',
      defaultEndTime: '18:00',
      defaultLateThresholdMins: 15,
      defaultHalfDayThresholdMins: 240,
      defaultAbsentThresholdMins: 480,
      defaultGeofenceRadius: 200,
      faceConfidenceThreshold: 0.6,
      gpsAccuracyThreshold: 50,
      timezone: 'Asia/Kolkata',
    },
    update: {},
  })
  console.log('✅ Global settings created')

  // ── Admin User ────────────────────────────────────────────
  const adminPin = await bcrypt.hash('1234', 12)
  const admin = await prisma.user.upsert({
    where: { employeeId: 'ADMIN-001' },
    create: {
      employeeId: 'ADMIN-001',
      name: 'Super Admin',
      email: 'admin@attendsp.com',
      phone: '+919000000001',
      pinHash: adminPin,
      role: 'SUPER_ADMIN',
      isActive: true,
      employee: { create: {} },
    },
    update: {},
  })
  console.log(`✅ Admin created: ${admin.employeeId} (PIN: 1234)`)

  // ── Sites ─────────────────────────────────────────────────
  const site1 = await prisma.site.upsert({
    where: { code: 'SITE-001' },
    create: {
      name: 'Downtown Construction Site',
      code: 'SITE-001',
      address: '123 Main Street, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      latitude: 19.0760,
      longitude: 72.8777,
      radiusMeters: 200,
      startTime: '08:00',
      endTime: '17:00',
      lateThresholdMins: 15,
      halfDayThresholdMins: 240,
      managerName: 'Rajesh Kumar',
      managerPhone: '+919000000010',
    },
    update: {},
  })

  const site2 = await prisma.site.upsert({
    where: { code: 'SITE-002' },
    create: {
      name: 'North Extension Project',
      code: 'SITE-002',
      address: '456 Industrial Area, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      latitude: 18.5204,
      longitude: 73.8567,
      radiusMeters: 150,
      startTime: '09:00',
      endTime: '18:00',
      lateThresholdMins: 10,
      halfDayThresholdMins: 240,
      managerName: 'Priya Sharma',
      managerPhone: '+919000000011',
    },
    update: {},
  })
  console.log(`✅ Sites created: ${site1.code}, ${site2.code}`)

  // ── Workers ───────────────────────────────────────────────
  const workerPin = await bcrypt.hash('0000', 12)
  const workers = [
    { employeeId: 'EMP-0001', name: 'Ahmed Khan', phone: '+919100000001', designation: 'Mason' },
    { employeeId: 'EMP-0002', name: 'Suresh Patel', phone: '+919100000002', designation: 'Electrician' },
    { employeeId: 'EMP-0003', name: 'Ravi Singh', phone: '+919100000003', designation: 'Plumber' },
    { employeeId: 'EMP-0004', name: 'Mohan Das', phone: '+919100000004', designation: 'Carpenter' },
    { employeeId: 'EMP-0005', name: 'Lakshmi Devi', phone: '+919100000005', designation: 'Painter' },
  ]

  for (const worker of workers) {
    const u = await prisma.user.upsert({
      where: { employeeId: worker.employeeId },
      create: {
        ...worker,
        pinHash: workerPin,
        role: 'WORKER',
        isActive: true,
        designation: worker.designation,
        employee: {
          create: {
            joiningDate: new Date('2024-01-01'),
            siteAssignments: {
              create: {
                siteId: site1.id,
                isPrimary: true,
              },
            },
          },
        },
      },
      update: {},
    })
    console.log(`✅ Worker: ${u.employeeId} - ${u.name} (PIN: 0000)`)
  }

  console.log('\n🎉 Seed complete!')
  console.log('─'.repeat(50))
  console.log('Admin Login  → ID: ADMIN-001  |  PIN: 1234')
  console.log('Worker Login → ID: EMP-0001   |  PIN: 0000')
  console.log('─'.repeat(50))
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
