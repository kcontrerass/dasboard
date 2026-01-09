'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface NoticesWidgetProps {
    notices: any[];
}

export default function NoticesWidget({ notices = [] }: NoticesWidgetProps) {
    const [filter, setFilter] = useState<'All' | 'Announcement' | 'Maintenance'>('All');

    // Simple filter logic (not strictly needed for the chart which shows totals, but good to keep)
    // Note: The original chart showed totals regardless of filter? 
    // Actually the original chart showed hardcoded logic based on types. 
    // Let's keep the chart showing distribution of the *current set* or just totals?
    // The original code calculated counts from the full `notices` array.

    const announcementCount = notices.filter(n => n.type !== 'Maintenance').length;
    const maintenanceCount = notices.filter(n => n.type === 'Maintenance').length;

    const data = [
        { name: 'Anuncios', value: announcementCount, color: '#6B7280' }, // gray-500
        { name: 'Mantenimiento', value: maintenanceCount, color: '#F97316' }, // orange-500
    ];

    // Filter just for list or future use if we listed items, but here we just show chart.
    // The select box updates state but the original code didn't use `filteredNotices` for the chart stats.
    // It only used it to variable `filteredNotices` which was unused in JSX. 
    // We'll keep the UI element as requested but maybe it should affect something? 
    // For now, I'll duplicate existing behavior: Filter UI exists, but chart shows global stats.

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card-light rounded-xl shadow-sm border border-gray-100 p-5"
        >
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-medium text-gray-900">Avisos</h2>
                <div className="relative">
                    <select
                        className="block w-full pl-3 pr-8 py-1 text-xs border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-gray-50 text-gray-700"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                    >
                        <option value="All">Todos</option>
                        <option value="Announcement">Anuncios</option>
                        <option value="Maintenance">Mantenimiento</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#374151', fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-gray-800">{announcementCount}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Anuncios</span>
                    </div>
                </div>

                <div className="flex justify-around w-full mt-4">
                    {data.map((stat) => (
                        <div key={stat.name} className="flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }}></div>
                                <span className="text-xs text-gray-500">{stat.name}</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
