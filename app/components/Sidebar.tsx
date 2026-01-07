import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
    close: () => void;
}

const menuItems = [
    { name: 'Dashboard', icon: 'grid_view', href: '/' },
    { name: 'Residential Unit', icon: 'home', href: '/units' },
    { name: 'User Management', icon: 'people', href: '/users' },
    { name: 'Visitors Management', icon: 'emoji_people', href: '/visitors' },
    { name: 'Notification', icon: 'notifications', href: '/notifications' },
    { name: 'Services & Facility', icon: 'plumbing', href: '/services' },
    { name: 'Accounts', icon: 'payments', href: '/accounts' },
    { name: 'Assets & Inventory', icon: 'inventory_2', href: '/inventory' },
    { name: 'Reports', icon: 'bar_chart', href: '/reports' },
    { name: 'Profile', icon: 'person', href: '/profile' },
    { name: 'Other', icon: 'more_horiz', href: '/other' },
];

export default function Sidebar({ isOpen, close }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-20 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={close}
            ></div>

            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-primary text-white flex flex-col transition-transform duration-300 transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-16 flex items-center px-6 border-b border-blue-900/50">
                    <span className="material-icons-outlined mr-2 text-2xl">apartment</span>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg leading-tight">AUMENTA</span>
                        <span className="text-[10px] text-blue-300 uppercase tracking-wider">
                            Management System
                        </span>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center justify-between px-6 py-3 transition-colors group ${isActive
                                        ? 'bg-white/10 border-l-4 border-white text-white'
                                        : 'text-blue-100 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                                    }`}
                                onClick={() => {
                                    // Close sidebar on mobile when a link is clicked
                                    if (window.innerWidth < 768) {
                                        close();
                                    }
                                }}
                            >
                                <div className="flex items-center flex-1">
                                    <span className={`material-icons-outlined mr-3 text-xl ${isActive ? '' : 'opacity-70 group-hover:opacity-100'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-medium">{item.name}</span>
                                </div>
                                {!isActive && (
                                    <span className="material-icons-outlined text-sm opacity-50">
                                        chevron_right
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
