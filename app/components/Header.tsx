'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../lib/actions';

interface HeaderProps {
    toggleSidebar: () => void;
    user?: any;
}

export default function Header({ toggleSidebar, user }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const userName = user?.name || 'Usuario Invitado';
    const userEmail = user?.email || '';
    const userImage = user?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHBORfy9k2aZMB96PxYlf67MYlxni-VWmSTcbyMm0kdGSK5BXONq1p7YHUau3RN5Vey6enSDiKbbLsYXB_QAze4ulTyzjtiGo8ZJRhz-C3A2jnoh0Fr1k9fq5P1CjSL1xUS4I3jBvR7g1F6AGu8DiyNRB2VLsMTu4gxkq10bLrY7Egp5HqE97dRFgc2rjTyq5Q4I1ksY5_NZGdrtUz2P0QnbyXwnthIBJm9Sss3aKAnTHSjtQO9L5KA7bvXagoG-adyYY2QILypa49';

    return (
        <header className="bg-card-light border-b border-gray-100 z-10 flex-shrink-0">
            <div className="flex items-center justify-between h-20 px-8">
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 mr-4 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <span className="material-icons-outlined text-2xl">menu</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            Hola, <span className="text-gray-500 font-normal">{userName}</span>
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                        <span className="material-icons-outlined text-[24px]">notifications</span>
                        {/* Notification dot example */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    <div className="flex items-center gap-3 relative">
                        <div className="hidden md:flex flex-col text-right">
                            <span className="text-sm font-semibold text-gray-900">{userName}</span>
                            <span className="text-xs text-gray-500">{userEmail}</span>
                        </div>

                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="focus:outline-none transition-transform active:scale-95 ml-2"
                        >
                            <img
                                alt="Profile"
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent hover:ring-gray-100 transition-all"
                                src={userImage}
                            />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                ></div>
                                <div className="absolute right-0 top-14 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-gray-200/50 py-2 z-20 border border-gray-50 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                    </div>
                                    <div className="p-1">
                                        <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                                            <span className="material-icons-outlined text-[20px] mr-3 text-gray-400">person</span>
                                            Perfil
                                        </a>
                                        <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                                            <span className="material-icons-outlined text-[20px] mr-3 text-gray-400">settings</span>
                                            Configuración
                                        </a>
                                    </div>
                                    <div className="border-t border-gray-50 p-1 mt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <span className="material-icons-outlined text-[20px] mr-3">logout</span>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
