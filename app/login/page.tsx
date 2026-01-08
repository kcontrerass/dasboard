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
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Left Sidebar */}
            <div className="w-80 bg-[#1A4373] text-white flex flex-col justify-between p-6">
                <div>
                    <div className="mb-10 flex items-center space-x-3">
                        <span className="material-icons-outlined text-4xl">admin_panel_settings</span>
                        <div>
                            <h1 className="text-xl font-bold leading-none">AUMENTA</h1>
                            <p className="text-xs text-blue-300 tracking-wider">ACCESO SEGURO</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleMenuClick(item)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${(currentView === item.view && !item.roleHint) || (item.roleHint && selectedRole === item.roleHint && currentView === 'login')
                                    ? 'bg-blue-600/50 text-white shadow-lg translate-x-1'
                                    : 'text-blue-100 hover:bg-white/10 hover:translate-x-1'
                                    }`}
                            >
                                <span className="material-icons-outlined">{item.icon}</span>
                                <span className="font-medium text-sm">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="text-xs text-blue-300/60 pb-4">
                    <p>© 2026 Aumenta System.</p>
                    <p>Todos los derechos reservados.</p>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A4373] rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1A4373] rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="w-full max-w-5xl grid md:grid-cols-3 bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 min-h-[600px]">

                    {/* -- VIEW SWITCHER -- */}

                    {currentView === 'login' ? (
                        /* LOGIN VIEW */
                        <>
                            {/* Left Side: Illustration layer */}
                            <div className="hidden md:flex md:col-span-1 bg-gradient-to-br from-[#1A4373] to-[#2c5d96] p-8 text-white flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <h2 className="text-3xl font-bold mb-4 relative z-10">Bienvenido</h2>
                                <p className="text-blue-100 leading-relaxed relative z-10 mb-8">
                                    Accede a tu panel para gestionar unidades, visitantes y servicios de manera eficiente.
                                </p>
                            </div>

                            {/* Right Side: Login Form */}
                            <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-center">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
                                    <p className="text-sm text-gray-500 mt-1">Por favor ingresa tus credenciales para continuar.</p>

                                    {successMessage && (
                                        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded text-sm border border-green-200">
                                            {successMessage}
                                        </div>
                                    )}
                                </div>

                                <form action={formAction} className="space-y-6">
                                    {/* Role Selector */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Seleccionar Rol</label>
                                        <input type="hidden" name="role" value={selectedRole} />
                                        <div className="flex flex-wrap gap-2">
                                            {roles.map(role => (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => setSelectedRole(role.id)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${selectedRole === role.id
                                                        ? 'bg-[#1A4373] text-white border-[#1A4373] shadow-md transform scale-105'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#1A4373] hover:text-[#1A4373]'
                                                        }`}
                                                >
                                                    {role.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 material-icons-outlined text-sm">email</span>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A4373] focus:border-transparent transition-shadow outline-none"
                                                    placeholder="nombre@empresa.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 material-icons-outlined text-sm">lock</span>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A4373] focus:border-transparent transition-shadow outline-none"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {!state.success && state.message && (
                                        <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                                            {state.message}
                                        </p>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full bg-[#1A4373] text-white font-bold py-3 rounded-lg shadow-lg hover:bg-[#15365d] active:transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                        >
                                            {isPending ? (
                                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            ) : (
                                                'INGRESAR'
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <a href="#" className="text-sm text-gray-400 hover:text-[#1A4373] transition-colors">¿Olvidaste tu contraseña?</a>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        /* REGISTER VIEW */
                        <>
                            {/* Left Side: Summary/Info for Register */}
                            <div className="hidden md:flex md:col-span-1 bg-gradient-to-br from-[#1A4373] to-[#2c5d96] p-8 text-white flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <h2 className="text-3xl font-bold mb-4 relative z-10">Únete a la Comunidad</h2>
                                <p className="text-blue-100 leading-relaxed relative z-10 mb-8">
                                    Registra tu perfil para acceder a los servicios de la comunidad y recibir notificaciones.
                                </p>
                                <ul className="space-y-3 relative z-10 text-sm text-blue-100">
                                    <li className="flex items-center"><span className="material-icons-outlined mr-2">check</span> Gestionar Visitantes</li>
                                    <li className="flex items-center"><span className="material-icons-outlined mr-2">check</span> Ver Facturas</li>
                                    <li className="flex items-center"><span className="material-icons-outlined mr-2">check</span> Reservar Áreas</li>
                                </ul>
                            </div>

                            {/* Right Side: Register Form Component */}
                            <RegisterForm onSuccess={handleRegisterSuccess} />
                        </>
                    )}

                </div>
            </main>
        </div>
    );
}
