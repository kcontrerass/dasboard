export interface VisitorStat {
    label: string;
    value: number;
    color: string;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    type: 'Cleaning' | 'Maintenance' | 'General' | 'Parking';
    status: 'Approved' | 'Pending';
    borderColor: string;
}

export interface Invoice {
    id: string;
    amount: number;
    person: string;
    status: 'Unpaid' | 'Fully Paid';
    category: 'water' | 'electricity' | 'maintenance' | 'other';
}

export interface Message {
    id: string;
    sender: string;
    content: string;
    date: string;
    avatarColor: string;
}

export const activeVisitors = 8;
export const visitorStats: VisitorStat[] = [
    { label: 'Check-In', value: 6, color: 'bg-yellow-400' },
    { label: 'Check-Out', value: 2, color: 'bg-green-500' },
];

export const noticesData: Notice[] = [
    {
        id: '1',
        title: 'Cleaning Building',
        content: 'Cleaning Building',
        startDate: '11/02/2025',
        endDate: '31/10/2025',
        type: 'Cleaning',
        status: 'Approved',
        borderColor: 'border-l-green-500',
    },
    {
        id: '2',
        title: 'Maintenance',
        content: 'Maintenance Notice',
        startDate: '23/04/2024',
        endDate: '23/04/2025',
        type: 'Maintenance',
        status: 'Approved',
        borderColor: 'border-l-orange-400',
    },
    {
        id: '3',
        title: 'Clean Your Home',
        content: 'Clean your home',
        startDate: '31/12/2024',
        endDate: '11/02/2026',
        type: 'General',
        status: 'Approved',
        borderColor: 'border-l-blue-400',
    },
    {
        id: '4',
        title: 'Park Vehicle Properly.',
        content: 'Park Vehicle Properly.',
        startDate: '31/12/2024',
        endDate: '31/12/2026',
        type: 'Parking',
        status: 'Approved',
        borderColor: 'border-l-teal-400',
    },
];

export const invoicesData: Invoice[] = [
    { id: 'INV-00304', amount: 0, person: 'David Smith', status: 'Unpaid', category: 'maintenance' },
    { id: 'INV-00304', amount: 0, person: 'David Smith', status: 'Unpaid', category: 'water' },
    { id: 'INV-00301', amount: 1050, person: 'David Smith', status: 'Fully Paid', category: 'maintenance' },
    { id: 'INV-00279', amount: 0, person: 'David Smith', status: 'Unpaid', category: 'maintenance' },
    { id: 'INV-00246', amount: 1275308515, person: 'David Smith', status: 'Unpaid', category: 'maintenance' },
];

export const messagesData: Message[] = [
    { id: '1', sender: 'David Smith', content: 'Test send', date: '16/06/2024', avatarColor: 'bg-green-500' },
    { id: '2', sender: 'David Smith', content: 'jyjtty', date: '19/05/2024', avatarColor: 'bg-cyan-500' },
    { id: '3', sender: 'David Smith', content: 'hello hello hello hello hello', date: '03/05/2024', avatarColor: 'bg-orange-300' },
    { id: '4', sender: 'David Smith', content: 'All member For Meeting', date: '22/11/2022', avatarColor: 'bg-orange-500' },
    { id: '5', sender: 'David Smith', content: 'cghfhdf', date: '22/11/2022', avatarColor: 'bg-yellow-400' },
];
