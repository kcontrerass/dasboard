'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        // Clear the auth cookie
        document.cookie = "auth_token=; path=/; max-age=0";
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="bg-card-light shadow-sm z-10 flex-shrink-0">
            <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 mr-3 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <span className="material-icons-outlined text-2xl">menu</span>
                    </button>
                    <h1 className="text-xl font-medium text-gray-800">
                        Welcome, David Smith
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-lg">
                        <span className="material-icons-outlined text-xl">notifications</span>
                    </button>
                    <div className="flex items-center pl-4 border-l border-gray-200 relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="focus:outline-none transition-transform active:scale-95"
                        >
                            <img
                                alt="Profile"
                                className="h-9 w-9 rounded-full object-cover border border-gray-200 hover:border-blue-500 cursor-pointer"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHBORfy9k2aZMB96PxYlf67MYlxni-VWmSTcbyMm0kdGSK5BXONq1p7YHUau3RN5Vey6enSDiKbbLsYXB_QAze4ulTyzjtiGo8ZJRhz-C3A2jnoh0Fr1k9fq5P1CjSL1xUS4I3jBvR7g1F6AGu8DiyNRB2VLsMTu4gxkq10bLrY7Egp5HqE97dRFgc2rjTyq5Q4I1ksY5_NZGdrtUz2P0QnbyXwnthIBJm9Sss3aKAnTHSjtQO9L5KA7bvXagoG-adyYY2QILypa49"
                            />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                ></div>
                                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">David Smith</p>
                                        <p className="text-xs text-gray-500 truncate">david.smith@example.com</p>
                                    </div>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                        <span className="material-icons-outlined text-sm mr-2">person</span>
                                        Profile
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                        <span className="material-icons-outlined text-sm mr-2">settings</span>
                                        Settings
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <span className="material-icons-outlined text-sm mr-2">logout</span>
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
