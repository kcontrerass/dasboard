interface VisitorsWidgetProps {
    totalVisitors: number;
}

export default function VisitorsWidget({ totalVisitors }: VisitorsWidgetProps) {
    // Mock distribution based on real total for now
    const visitorStats = [
        { label: 'Nuevos', value: Math.floor(totalVisitors * 0.4), color: 'bg-yellow-400' },
        { label: 'Habituales', value: Math.floor(totalVisitors * 0.6), color: 'bg-green-500' },
    ];

    return (
        <div className="bg-card-light rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-medium text-gray-900">Visitantes</h2>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <span className="material-icons-outlined text-lg">open_in_new</span>
                </button>
            </div>
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full chart-donut-visitors flex items-center justify-center">
                    <div className="w-32 h-32 bg-card-light rounded-full flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{totalVisitors}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Total</span>
                    </div>
                </div>
                <div className="flex justify-around w-full mt-8">
                    {visitorStats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center">
                            <div className={`w-2 h-2 ${stat.color} rounded-full mb-2`}></div>
                            <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                            <span className="text-xs text-gray-500">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
