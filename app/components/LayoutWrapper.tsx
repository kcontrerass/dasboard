'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutWrapperProps {
    children: React.ReactNode;
    userRole: string;
    user?: any; // Consider adding a proper type later
}

export default function LayoutWrapper({
    children,
    userRole,
    user
}: LayoutWrapperProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} userRole={userRole} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} user={user} />
                {children}
            </div>
        </>
    );
}
