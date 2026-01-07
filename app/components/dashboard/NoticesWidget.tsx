'use client';
import { useState } from 'react';
import { noticesData } from '../../lib/mockData';

export default function NoticesWidget() {
    const [filter, setFilter] = useState<'All' | 'Announcement' | 'Maintenance'>('All');

    // Simple filter logic for demo purposes
    // In a real app, you might match against specific types defined in Notice interface
    const filteredNotices = noticesData.filter((notice) => {
        if (filter === 'All') return true;
        if (filter === 'Announcement' && notice.type === 'Cleaning') return true; // Just mapping for demo
        if (filter === 'Maintenance' && notice.type === 'Maintenance') return true;
        return true;
    });

    // For the donut chart visualization (static for now based on mock)
    const total = noticesData.length;
    const announcementCount = noticesData.filter(n => n.type === 'Cleaning' || n.type === 'General' || n.type === 'Parking').length; // Treating these as general announcements
    const maintenanceCount = noticesData.filter(n => n.type === 'Maintenance').length;

    return (
        <div className="bg-card-light rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-medium text-gray-900">Notices</h2>
                <div className="relative">
                    <select
                        className="block w-full pl-3 pr-8 py-1 text-xs border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-gray-50 text-gray-700"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                    >
                        <option value="All">All</option>
                        <option value="Announcement">Announcement</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full chart-donut-notices flex items-center justify-center">
                    <div className="w-32 h-32 bg-card-light rounded-full flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{announcementCount}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Announcements</span>
                    </div>
                </div>
                <div className="flex justify-around w-full mt-8">
                    <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mb-2"></div>
                        <span className="text-2xl font-bold text-gray-800">{announcementCount}</span>
                        <span className="text-xs text-gray-500">Approved Notice</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mb-2"></div>
                        <span className="text-2xl font-bold text-gray-800">{maintenanceCount}</span>
                        <span className="text-xs text-gray-500">Maintenance</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
