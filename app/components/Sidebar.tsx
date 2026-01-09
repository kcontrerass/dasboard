import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
    close: () => void;
    userRole: string;
}

const menuItems = [
    { name: 'Tablero', icon: 'grid_view', href: '/', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'RESIDENT', 'ACCOUNTANT', 'STAFF', 'GATEKEEPER', 'MEMBER'] },
    { name: 'Unidad Residencial', icon: 'home', href: '/units', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Gestión de Usuarios', icon: 'people', href: '/users', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Visitantes', icon: 'emoji_people', href: '/visitors', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'GATEKEEPER'] },
    { name: 'Mensajes', icon: 'chat', href: '/messages', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'RESIDENT', 'ACCOUNTANT', 'STAFF', 'GATEKEEPER', 'MEMBER'] },
    { name: 'Notificaciones', icon: 'notifications', href: '/notifications', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Servicios e Instalaciones', icon: 'plumbing', href: '/services', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Cuentas', icon: 'payments', href: '/accounts', allowedRoles: ['SUPER_ADMIN', 'ACCOUNTANT'] },
    { name: 'Activos e Inventario', icon: 'inventory_2', href: '/inventory', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Reportes', icon: 'bar_chart', href: '/reports', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'] },
    { name: 'Perfil', icon: 'person', href: '/profile', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'RESIDENT', 'ACCOUNTANT', 'STAFF', 'GATEKEEPER', 'MEMBER'] },
    { name: 'Otros', icon: 'more_horiz', href: '/other', allowedRoles: ['SUPER_ADMIN'] },
];

export default function Sidebar({ isOpen, close, userRole }: SidebarProps) {
    const pathname = usePathname();

    // Filter items based on role
    const filteredItems = menuItems.filter(item =>
        item.allowedRoles.includes(userRole)
    );

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={close}
            ></div>

            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-card-light border-r border-gray-100 flex flex-col transition-transform duration-300 transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-white p-1.5 rounded-lg">
                            <span className="material-icons-outlined text-xl">apartment</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-lg leading-tight tracking-tight">AUMENTA</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {filteredItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-gray-50 text-primary font-semibold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                onClick={() => {
                                    // Close sidebar on mobile when a link is clicked
                                    if (window.innerWidth < 768) {
                                        close();
                                    }
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`material-icons-outlined text-[20px] ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm">{item.name}</span>
                                </div>
                                {isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Version */}
                <div className="p-6 border-t border-gray-50">
                    <p className="text-[10px] text-gray-300 text-center font-medium tracking-widest uppercase">v1.2.0</p>
                </div>
            </aside>
        </>
    );
}
