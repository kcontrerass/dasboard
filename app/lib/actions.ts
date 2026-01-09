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
            // Removed 'take: 5' to get full list for the dedicated page. 
            // If performance becomes an issue, we can add pagination later.
        })
        return { success: true, data: visitors }
    } catch (error) {
        console.error('Error fetching visitors:', error)
        return { success: false, data: [] }
    }
}

export async function createVisitor(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;

    if (!name || !type) {
        return { success: false, message: 'Nombre y tipo son obligatorios' };
    }

    try {
        await prisma.visitor.create({
            data: {
                name,
                type,
                status: 'CheckIn',
                checkInTime: new Date(),
            }
        });
        revalidatePath('/visitors');
        revalidatePath('/'); // Update dashboard stats too
        return { success: true, message: 'Visitante registrado correctamente' };
    } catch (error) {
        console.error('Error creating visitor:', error);
        return { success: false, message: 'Error al registrar visitante' };
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
    const user = await getCurrentUser();
    if (!user) return { success: false, data: [] };

    try {
        const messages = await prisma.message.findMany({
            where: { receiverId: user.id },
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

export async function getUsers() {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, data: [] };

    try {
        const users = await prisma.user.findMany({
            where: { NOT: { id: currentUser.id } },
            select: { id: true, name: true, email: true, role: true },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: users };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function sendMessage(prevState: any, formData: FormData) {
    // original implementation retained for compatibility
    const user = await getCurrentUser();
    if (!user) return { success: false, message: 'No autorizado' };

    const receiverId = Number(formData.get('receiverId'));
    const content = formData.get('content') as string;

    if (!receiverId || !content) {
        return { success: false, message: 'Destinatario y mensaje son obligatorios' };
    }

    try {
        await prisma.message.create({
            data: {
                content,
                senderId: user.id,
                receiverId: receiverId,
            },
        });
        revalidatePath('/messages');
        revalidatePath('/');
        return { success: true, message: 'Mensaje enviado correctamente' };
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, message: 'Error al enviar el mensaje' };
    }
}

/**
 * Wrapper server action that matches the expected `(formData) => void | Promise<void>`
 * signature for a `<form action={...}>` element.
 * It simply calls the original `sendMessage` and discards the returned value.
 */
export async function sendMessageAction(formData: FormData) {
    // We ignore the previous state because the UI does not need it here.
    await sendMessage(undefined, formData);
}



export async function getDashboardStats() {
    const visitorsCount = await prisma.visitor.count()
    const noticesCount = await prisma.notice.count()

    // Aggregate visitors by type
    const visitorGroups = await prisma.visitor.groupBy({
        by: ['type'],
        _count: {
            type: true,
        },
    })

    // Format for chart: [{ name: 'Guest', value: 10 }, ...]
    const visitorStats = visitorGroups.map(group => ({
        name: group.type,
        value: group._count.type
    }))

    return { visitorsCount, noticesCount, visitorStats }
}

// Booking System Actions

export async function getAmenities() {
    try {
        let amenities = await prisma.amenity.findMany()

        // Auto-seed if empty
        if (amenities.length === 0) {
            await prisma.amenity.createMany({
                data: [
                    { name: 'Piscina', description: 'Piscina recreativa y semi-olímpica' },
                    { name: 'Salón Social', description: 'Espacio para eventos y reuniones' },
                    { name: 'Zona BBQ', description: 'Asadores al aire libre' },
                    { name: 'Gimnasio', description: 'Equipamiento completo para ejercicio' },
                ]
            })
            amenities = await prisma.amenity.findMany()
        }

        return { success: true, data: amenities }
    } catch (error) {
        return { success: false, data: [] }
    }
}

export async function getCalendarData(month: number, year: number) {
    // Get start/end of the month view (a bit wider to cover padding days if needed)
    // Simplified: fetching items within the month range 
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                },
                status: 'Confirmed'
            },
            include: { user: { select: { name: true } }, amenity: true }
        })

        const events = await prisma.event.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        const notices = await prisma.notice.findMany({
            where: {
                startDate: { lte: endDate },
                endDate: { gte: startDate }
            }
        })

        return { success: true, data: { reservations, events, notices } }
    } catch (error) {
        return { success: false, data: { reservations: [], events: [], notices: [] } }
    }
}

export async function createReservation(prevState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: 'No autorizado' }

    const amenityId = Number(formData.get('amenityId'))
    const dateStr = formData.get('date') as string
    const startTimeStr = formData.get('startTime') as string
    const endTimeStr = formData.get('endTime') as string

    if (!amenityId || !dateStr || !startTimeStr || !endTimeStr) {
        return { success: false, message: 'Faltan campos obligatorios' }
    }

    // Construct Date objects
    // Assuming inputs are like '2023-01-01' and '14:00'
    const date = new Date(dateStr)
    const [startHour, startMin] = startTimeStr.split(':').map(Number)
    const [endHour, endMin] = endTimeStr.split(':').map(Number)

    const startTime = new Date(date)
    startTime.setHours(startHour, startMin)

    const endTime = new Date(date)
    endTime.setHours(endHour, endMin)

    if (endTime <= startTime) {
        return { success: false, message: 'La hora de fin debe ser posterior a la de inicio' }
    }

    try {
        // Check conflicts (simplified)
        const conflict = await prisma.reservation.findFirst({
            where: {
                amenityId,
                date: date,
                status: 'Confirmed',
                OR: [
                    { startTime: { lte: startTime }, endTime: { gt: startTime } },
                    { startTime: { lt: endTime }, endTime: { gte: endTime } }
                ]
            }
        })

        if (conflict) {
            return { success: false, message: 'Ya existe una reserva en ese horario' }
        }

        await prisma.reservation.create({
            data: {
                userId: user.id,
                amenityId,
                date,
                startTime,
                endTime,
                status: 'Confirmed'
            }
        })

        revalidatePath('/')
        return { success: true, message: 'Reserva creada exitosamente' }
    } catch (error) {
        return { success: false, message: 'Error al crear la reserva' }
    }
}

export async function createEvent(prevState: any, formData: FormData) {
    // Only Admin/Staff in real app, but for now we trust session
    const user = await getCurrentUser()
    if (!user) return { success: false, message: 'No autorizado' }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dateStr = formData.get('date') as string
    const startTimeStr = formData.get('startTime') as string

    if (!title || !dateStr) {
        return { success: false, message: 'Título y fecha obligatorios' }
    }

    const date = new Date(dateStr)
    const startTime = new Date(date)
    if (startTimeStr) {
        const [startHour, startMin] = startTimeStr.split(':').map(Number)
        startTime.setHours(startHour, startMin)
    }

    console.log('Creating event with data:', { title, dateStr, startTimeStr, description });

    try {
        await prisma.event.create({
            data: {
                title,
                description,
                date,
                startTime,
                type: 'General',
                userId: user.id // Save creator
            }
        })
        revalidatePath('/')
        return { success: true, message: 'Evento creado exitosamente' }
    } catch (error) {
        console.error('Error creating event:', error);
        return { success: false, message: 'Error al crear evento: ' + (error as Error).message }
    }
}

export async function getUpcomingEvents() {
    const user = await getCurrentUser()
    if (!user) return { success: false, data: { events: [], reservations: [] } }

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    try {
        const events = await prisma.event.findMany({
            where: {
                date: { gte: now }
            },
            include: {
                user: { select: { name: true } }
            },
            orderBy: { date: 'asc' }
        })

        // Logic: Admins/Staff see ALL reservations. Members see only THEIRS.
        const canViewAll = ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'GATEKEEPER'].includes(user.role);

        const reservationWhere: any = {
            date: { gte: now },
            status: 'Confirmed'
        };

        if (!canViewAll) {
            reservationWhere.userId = user.id;
        }

        const reservations = await prisma.reservation.findMany({
            where: reservationWhere,
            include: {
                amenity: true,
                user: { select: { name: true } } // Fetch creator name
            },
            orderBy: { date: 'asc' }
        })

        return { success: true, data: { events, reservations, isStaff: canViewAll } }
    } catch (error) {
        console.error('Error fetching upcoming events:', error)
        return { success: false, data: { events: [], reservations: [], isStaff: false } }
    }
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
        return { success: false, message: 'El correo y la contraseña son obligatorios' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { success: false, message: 'Usuario no encontrado' }
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return { success: false, message: 'Credenciales inválidas' }
        }

        // Validate Role
        if (role && user.role !== role) {
            return { success: false, message: `Acceso denegado. No tienes autorización como ${role.replace('_', ' ')}` }
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

        return { success: true, message: 'Inicio de sesión exitoso' }
    } catch (error) {
        console.error('Login error:', error)
        return { success: false, message: 'Algo salió mal' }
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
        return { success: false, message: 'Error al obtener perfil' }
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
        return { success: false, message: 'Error al obtener edificios' }
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
            return { success: false, message: 'Faltan campos obligatorios' }
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

        return { success: true, message: 'Miembro registrado exitosamente' }

    } catch (error) {
        console.error('Registration error:', error)
        return { success: false, message: 'Error en el registro. El correo podría estar duplicado.' }
    }
}
