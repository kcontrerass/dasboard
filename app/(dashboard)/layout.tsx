import { cookies } from 'next/headers';
import LayoutWrapper from '../components/LayoutWrapper';
import { getCurrentUser } from '../lib/actions';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user_role')?.value || 'MEMBER';

    // Fetch full user data
    const user = await getCurrentUser();

    return (
        <div className="bg-background-light text-gray-800 font-sans antialiased h-screen flex overflow-hidden selection:bg-blue-500 selection:text-white">
            <LayoutWrapper userRole={userRole} user={user}>{children}</LayoutWrapper>
        </div>
    );
}
