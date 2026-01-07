'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                {children}
            </div>
        </>
    );
}
