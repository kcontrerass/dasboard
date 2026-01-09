
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    console.log('Checking for Event model...');
    if ('event' in prisma) {
        console.log('SUCCESS: prisma.event exists!');
        // @ts-ignore
        console.log('User model:', !!prisma.user);
    } else {
        console.log('FAILURE: prisma.event is MISSING.');
        console.log('Available properties:', Object.keys(prisma));
    }
}

check().catch(console.error);
