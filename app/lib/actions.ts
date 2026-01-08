'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Dashboard Statistics & Data

export async function getVisitors() {
    try {
        const visitors = await prisma.visitor.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        })
        return { success: true, data: visitors }
    } catch (error) {
        console.error('Error fetching visitors:', error)
        return { success: false, data: [] }
    }
}

export async function getNotices() {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: notices }
    } catch (error) {
        console.error('Error fetching notices:', error)
        return { success: false, data: [] }
    }
}

export async function getInvoices() {
    try {
        const invoices = await prisma.invoice.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { user: { select: { name: true } } }
        })
        return { success: true, data: invoices }
    } catch (error) {
        console.error('Error fetching invoices:', error)
        return { success: false, data: [] }
    }
}

export async function getMessages() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { sender: { select: { name: true } } }
        })
        return { success: true, data: messages }
    } catch (error) {
        console.error('Error fetching messages:', error)
        return { success: false, data: [] }
    }
}

export async function getDashboardStats() {
    // You can implement aggregation here if needed
    // For now we return counts
    const visitorsCount = await prisma.visitor.count()
    const noticesCount = await prisma.notice.count()
    return { visitorsCount, noticesCount }
}

// Authentication

import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_me')
const ALG = 'HS256'

// ... existing code ...

export async function login(currentState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    console.log('Login attempt:', { email, role })

    if (!email || !password) {
        return { success: false, message: 'Email and password are required' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { success: false, message: 'User not found' }
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return { success: false, message: 'Invalid credentials' }
        }

        // Validate Role
        if (role && user.role !== role) {
            return { success: false, message: `Access denied. You are not authorized as ${role.replace('_', ' ')}` }
        }

        // Create JWT
        const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
            .setProtectedHeader({ alg: ALG })
            .setExpirationTime('24h')
            .sign(JWT_SECRET)

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        })

        // Set role cookie (still useful for optimistic UI, but token is source of truth)
        cookieStore.set('user_role', user.role, {
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24
        })

        return { success: true, message: 'Login successful' }
    } catch (error) {
        console.error('Login error:', error)
        return { success: false, message: 'Something went wrong' }
    }
}

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const userId = Number(payload.userId)

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, image: true }
        })

        return user
    } catch (error) {
        return null
    }
}

export async function getUserProfile() {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const userId = Number(payload.userId)

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                memberProfile: {
                    include: {
                        unit: {
                            include: {
                                building: true
                            }
                        }
                    }
                },
                familyMembers: true
            }
        })

        return { success: true, data: user }
    } catch (error) {
        return { success: false, message: 'Failed to fetch profile' }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
    cookieStore.delete('user_role')
    revalidatePath('/')
}

// Registration
export async function getBuildingOptions() {
    try {
        const buildings = await prisma.building.findMany({
            include: { units: true }
        })
        return { success: true, data: buildings }
    } catch (error) {
        return { success: false, message: 'Failed to fetch buildings' }
    }
}

export async function registerMember(currentState: any, formData: FormData) {
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const unitId = Number(formData.get('unitId'))
        const gender = formData.get('gender') as string
        const mobileNumber = formData.get('mobileNumber') as string
        const dob = new Date(formData.get('dob') as string)
        const occupiedDate = new Date(formData.get('occupiedDate') as string)

        const familyMembersJSON = formData.get('familyMembers') as string
        const familyMembers = familyMembersJSON ? JSON.parse(familyMembersJSON) : []

        const roleInput = formData.get('role') as string
        const allowedRoles = ['MEMBER', 'ACCOUNTANT', 'STAFF', 'GATEKEEPER']
        const role = allowedRoles.includes(roleInput) ? roleInput : 'MEMBER'

        if (!email || !password || !firstName || !lastName) {
            return { success: false, message: 'Missing required fields' }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Use transaction to ensure all data is created or none
        await prisma.$transaction(async (tx: any) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: `${firstName} ${lastName}`,
                    role: role,
                }
            })

            // 2. Create Member Profile
            await tx.memberProfile.create({
                data: {
                    userId: user.id,
                    firstName,
                    lastName,
                    middleName: formData.get('middleName') as string,
                    dob,
                    gender,
                    mobileNumber,
                    address: formData.get('address') as string,
                    status: formData.get('status') as string,
                    occupiedDate,
                    unitId: unitId || null,
                }
            })

            // 3. Create Family Members
            if (familyMembers.length > 0) {
                await tx.familyMember.createMany({
                    data: familyMembers.map((fm: any) => ({
                        userId: user.id,
                        name: fm.name,
                        gender: fm.gender,
                        dob: new Date(fm.dob),
                        relation: fm.relation
                    }))
                })
            }
        })

        return { success: true, message: 'Member registered successfully' }

    } catch (error) {
        console.error('Registration error:', error)
        return { success: false, message: 'Registration failed. Email might be duplicates.' }
    }
}
