'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../lib/actions';
import RegisterForm from '../components/auth/RegisterForm';

interface MenuItem {
    name: string;
    icon: string;
    view: 'login' | 'register';
    roleHint?: string;
}

// Menu Items Data
const menuItems: MenuItem[] = [
    { name: 'Acceso Administración', icon: 'apartment', view: 'login' },
    { name: 'Registro de Miembros', icon: 'person_add', view: 'register' },
];

// Role Options
const roles = [
    { id: 'SUPER_ADMIN', label: 'Admin' },
    { id: 'RESIDENT', label: 'Residente' },
    { id: 'ACCOUNTANT', label: 'Contador' },
    { id: 'STAFF', label: 'Personal' },
    { id: 'GATEKEEPER', label: 'Vigilante' },
    { id: 'MEMBER', label: 'Miembro' },
];

const initialState = {
    message: '',
    success: false,
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState('SUPER_ADMIN');
    const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (state.success) {
            router.push('/');
        }
    }, [state.success, router]);

    const handleMenuClick = (item: any) => {
        setCurrentView(item.view);
        if (item.roleHint) {
            setSelectedRole(item.roleHint);
        }
    };

    const handleRegisterSuccess = () => {
        setSuccessMessage('¡Registro exitoso! Por favor inicia sesión con tu nueva cuenta.');
        setCurrentView('login');
        setSelectedRole('MEMBER');
    };

    return (
        <div className="lg:flex min-h-screen bg-white font-sans text-gray-900">
            {/* Left Section: Context & Navigation */}
            <div className="lg:w-[480px] bg-gray-50 border-r border-gray-100 flex flex-col justify-between p-8 md:p-12 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/2 -translate-y-1/2 opacity-60"></div>

                <div className="relative z-10">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gray-900 text-white p-2 rounded-lg">
                                <span className="material-icons-outlined text-xl">apartment</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">AUMENTA</h1>
                        </div>
                        <p className="text-gray-500 text-sm pl-12">Gestión Residencial Inteligente</p>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleMenuClick(item)}
                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 text-left group ${(currentView === item.view && !item.roleHint) || (item.roleHint && selectedRole === item.roleHint && currentView === 'login')
                                        ? 'bg-white shadow-sm ring-1 ring-gray-200'
                                        : 'hover:bg-gray-100/80 text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <span className={`material-icons-outlined text-2xl transition-colors ${(currentView === item.view && !item.roleHint) || (item.roleHint && selectedRole === item.roleHint && currentView === 'login')
                                        ? 'text-gray-900'
                                        : 'text-gray-400 group-hover:text-gray-900'
                                    }`}>{item.icon}</span>
                                <span className="font-semibold text-sm">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="relative z-10 text-xs text-gray-400 font-medium tracking-wide">
                    <p>© 2026 Aumenta System.</p>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {currentView === 'login' ? (
                        /* LOGIN VIEW */
                        <div>
                            <div className="mb-10 text-center lg:text-left">
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Bienvenido de nuevo</h2>
                                <p className="text-gray-500">Ingresa a tu cuenta para gestionar tu comunidad.</p>

                                {successMessage && (
                                    <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100 flex items-center gap-2">
                                        <span className="material-icons-outlined text-lg">check_circle</span>
                                        {successMessage}
                                    </div>
                                )}
                            </div>

                            <form action={formAction} className="space-y-8">
                                {/* Role Selector - Minimalist Tags */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rol de Usuario</label>
                                    <input type="hidden" name="role" value={selectedRole} />
                                    <div className="flex flex-wrap gap-2">
                                        {roles.map(role => (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setSelectedRole(role.id)}
                                                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border ${selectedRole === role.id
                                                    ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                                                    }`}
                                            >
                                                {role.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none placeholder:text-gray-400"
                                            placeholder="nombre@empresa.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-semibold text-gray-900">Contraseña</label>
                                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">¿Olvidaste tu contraseña?</a>
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none placeholder:text-gray-400"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                {!state.success && state.message && (
                                    <p className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-2">
                                        <span className="material-icons-outlined text-lg">error_outline</span>
                                        {state.message}
                                    </p>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                    >
                                        {isPending ? (
                                            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            'Iniciar Sesión'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        /* REGISTER VIEW */
                        <div className="w-full">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Crear Cuenta</h2>
                                <p className="text-gray-500">Únete a la comunidad digital.</p>
                            </div>
                            <RegisterForm onSuccess={handleRegisterSuccess} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
