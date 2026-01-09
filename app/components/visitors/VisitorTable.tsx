'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Visitor {
    id: number;
    name: string;
    type: string;
    status: string;
    checkInTime: string; // Serialized date from server
    checkOutTime?: string;
}

interface VisitorTableProps {
    visitors: Visitor[];
}

export default function VisitorTable({ visitors }: VisitorTableProps) {
    if (visitors.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons-outlined text-gray-400 text-3xl">emoji_people</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No hay visitantes</h3>
                <p className="text-gray-500 text-sm mt-1">Registra la primera visita para comenzar.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Tipo</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Entrada</th>
                            <th className="px-6 py-4">Salida</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {visitors.map((visitor) => (
                            <tr key={visitor.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {visitor.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-900">{visitor.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                        ${visitor.type === 'Guest' ? 'bg-purple-100 text-purple-600' : ''}
                                        ${visitor.type === 'Delivery' ? 'bg-orange-100 text-orange-600' : ''}
                                        ${visitor.type === 'Contractor' ? 'bg-gray-100 text-gray-600' : ''}
                                        ${!['Guest', 'Delivery', 'Contractor'].includes(visitor.type) ? 'bg-blue-100 text-blue-600' : ''}
                                    `}>
                                        {visitor.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${visitor.status === 'CheckIn' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                        <span className="text-sm text-gray-700">{visitor.status === 'CheckIn' ? 'Activo' : 'Finalizado'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {format(new Date(visitor.checkInTime), 'd MMM yyyy, HH:mm', { locale: es })}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {visitor.checkOutTime ? format(new Date(visitor.checkOutTime), 'HH:mm', { locale: es }) : '--:--'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
