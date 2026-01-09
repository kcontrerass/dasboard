'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface VisitorsWidgetProps {
    totalVisitors: number;
}

export default function VisitorsWidget({ totalVisitors }: VisitorsWidgetProps) {
    const data = [
        { name: 'Nuevos', value: Math.floor(totalVisitors * 0.4), color: '#FBBF24' }, // yellow-400
        { name: 'Habituales', value: Math.floor(totalVisitors * 0.6), color: '#22C55E' }, // green-500
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card-light rounded-xl shadow-sm border border-gray-100 p-5"
        >
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-medium text-gray-900">Visitantes</h2>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <span className="material-icons-outlined text-lg">open_in_new</span>
                </button>
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
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-gray-800">{totalVisitors}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Total</span>
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
