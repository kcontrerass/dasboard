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
        <div className="bg-background-light text-gray-600 font-sans antialiased h-screen flex overflow-hidden selection:bg-primary/20 selection:text-primary">
            <LayoutWrapper userRole={userRole} user={user}>{children}</LayoutWrapper>
        </div>
    );
}
