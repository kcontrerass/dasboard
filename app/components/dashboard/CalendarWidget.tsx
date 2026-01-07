'use client';
import { useState } from 'react';

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026

    const monthNames = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Basic calendar logic to show days (simplified for UI demo)
    // In a real app, you'd calculate correct start day of week, etc.
    const days = [];
    // Hardcoded for demo to match the visual requirement roughly, or generated dynamically
    // Let's generate a 7x5 grid for simplicity
    for (let i = 1; i <= 35; i++) {
        let dayNum = i - 4; // Offset to start previous month
        if (dayNum <= 0) dayNum += 31; // Prev month logic simplified
        if (dayNum > 31) dayNum -= 31; // Next month simplified
        days.push(dayNum);
    }

    return (
        <div className="bg-card-light rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-lg font-medium text-gray-900">Calendar</h2>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                        <span className="text-gray-600">Notice</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span className="text-gray-600">Event</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-gray-600">Booking Facility</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-100">
                        <span className="material-icons-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="px-3 py-1 rounded border border-gray-200 text-sm font-medium hover:bg-gray-50">
                        Today
                    </button>
                    <button onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-100">
                        <span className="material-icons-outlined text-sm">chevron_right</span>
                    </button>
                </div>
                <h3 className="font-semibold text-gray-700">
                    {monthNames[currentMonth]} {currentYear}
                </h3>
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button className="px-3 py-1 bg-white text-xs font-medium rounded shadow-sm">Month</button>
                    <button className="px-3 py-1 text-gray-500 text-xs font-medium rounded hover:bg-white">Week</button>
                    <button className="px-3 py-1 text-gray-500 text-xs font-medium rounded hover:bg-white">Day</button>
                    <button className="px-3 py-1 text-gray-500 text-xs font-medium rounded hover:bg-white">List</button>
                </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 text-center text-xs font-semibold text-gray-500 py-2">
                    <div>SUN</div>
                    <div>MON</div>
                    <div>TUE</div>
                    <div>WED</div>
                    <div>THU</div>
                    <div>FRI</div>
                    <div>SAT</div>
                </div>
                <div className="grid grid-cols-7 text-xs h-64 bg-white">
                    {days.map((day, index) => (
                        <div key={index} className={`border-b ${index % 7 !== 6 ? 'border-r' : ''} border-gray-100 p-1 min-h-[50px]`}>
                            <span className={`block text-right ${day >= 1 && day <= 31 ? 'text-gray-700' : 'text-gray-400'}`}>{day}</span>
                            {day === 1 && (<span className="block text-[10px] text-gray-400">+2 more</span>)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
