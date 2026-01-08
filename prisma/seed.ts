import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // 1. Create Users
    const passwordHash = await bcrypt.hash('password123', 10)

    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            password: passwordHash, // Force update password
            role: 'SUPER_ADMIN', // Ensure role is super admin
        },
        create: {
            email: 'admin@example.com',
            name: 'Jorge Administrador',
            password: passwordHash,
            role: 'SUPER_ADMIN',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHBORfy9k2aZMB96PxYlf67MYlxni-VWmSTcbyMm0kdGSK5BXONq1p7YHUau3RN5Vey6enSDiKbbLsYXB_QAze4ulTyzjtiGo8ZJRhz-C3A2jnoh0Fr1k9fq5P1CjSL1xUS4I3jBvR7g1F6AGu8DiyNRB2VLsMTu4gxkq10bLrY7Egp5HqE97dRFgc2rjTyq5Q4I1ksY5_NZGdrtUz2P0QnbyXwnthIBJm9Sss3aKAnTHSjtQO9L5KA7bvXagoG-adyYY2QILypa49',
        },
    })

    // 2. Create Visitors
    await prisma.visitor.createMany({
        data: [
            { name: 'John Doe', type: 'Guest', status: 'CheckIn', checkInTime: new Date() },
            { name: 'Jane Smith', type: 'Delivery', status: 'CheckOut', checkInTime: new Date(Date.now() - 3600000), checkOutTime: new Date() },
            { name: 'Michael Brown', type: 'Service', status: 'CheckIn', checkInTime: new Date(Date.now() - 1800000) },
        ],
    })

    // 3. Create Notices
    await prisma.notice.createMany({
        data: [
            {
                title: 'Water Tank Cleaning',
                content: 'Scheduled maintenance for block A',
                type: 'Cleaning',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                borderColor: 'border-blue-500',
                status: 'Approved'
            },
            {
                title: 'Parking Maintenance',
                content: 'Basement parking will be closed',
                type: 'General',
                startDate: new Date(),
                endDate: new Date(Date.now() + 172800000),
                borderColor: 'border-yellow-500',
                status: 'Pending'
            }
        ]
    })

    // 3. Create Dummy Users for Messages/Invoices
    const user2 = await prisma.user.upsert({
        where: { email: 'user2@example.com' },
        update: {},
        create: {
            email: 'user2@example.com',
            name: 'John Doe',
            password: passwordHash,
            role: 'MEMBER'
        }
    })

    const user3 = await prisma.user.upsert({
        where: { email: 'user3@example.com' },
        update: {},
        create: {
            email: 'user3@example.com',
            name: 'Jane Smith',
            password: passwordHash,
            role: 'MEMBER'
        }
    })

    // 4. Create Invoices
    await prisma.invoice.upsert({
        where: { id: 'INV-10234' },
        update: {},
        create: {
            id: 'INV-10234',
            amount: 1250.00,
            status: 'Unpaid',
            category: 'Maintenance',
            userId: superAdmin.id,
        }
    })

    await prisma.invoice.upsert({
        where: { id: 'INV-10235' },
        update: {},
        create: {
            id: 'INV-10235',
            amount: 450.50,
            status: 'Paid',
            category: 'Electricity',
            userId: superAdmin.id,
        }
    })

    // 5. Create Messages
    await prisma.message.createMany({
        data: [
            { content: "Hey, can you fix the lights?", senderId: user2.id, receiverId: superAdmin.id, avatarColor: "bg-green-500" },
            { content: "Maintenance fee paid.", senderId: user3.id, receiverId: superAdmin.id, avatarColor: "bg-purple-500" },
            { content: "Visitor arrived for you.", senderId: superAdmin.id, receiverId: user2.id, avatarColor: "bg-blue-500" },
        ]
    })

    // 6. Create Buildings & Units
    const buildingA = await prisma.building.create({
        data: {
            name: 'Skyline Heights',
            units: {
                create: [
                    { name: '101', category: 'Residential' },
                    { name: '102', category: 'Residential' },
                    { name: '201', category: 'Commercial' }
                ]
            }
        }
    })

    console.log('Buildings seeded:', buildingA.id)

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
