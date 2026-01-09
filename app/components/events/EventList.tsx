'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Event {
    id: number;
    title: string;
    description: string | null;
    date: string; // ISO string
    startTime: string; // ISO string
    type: string;
    location: string | null;
    user?: { name: string } | null;
}

interface Reservation {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    amenity: {
        name: string;
    };
    user?: { name: string };
}

interface EventListProps {
    events: Event[];
    reservations: Reservation[];
    isStaff?: boolean;
}

export default function EventList({ events, reservations, isStaff = false }: EventListProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'reservations'>('all');

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'all' ? 'text-primary border-b-2 border-primary bg-gray-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Próximos Eventos
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {events.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('reservations')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'reservations' ? 'text-primary border-b-2 border-primary bg-gray-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    {isStaff ? 'Todas las Reservas' : 'Mis Reservas'}
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {reservations.length}
                    </span>
                </button>
            </div>

            <div className="p-6 min-h-[400px]">
                {/* Community Events List */}
                {activeTab === 'all' && (
                    <div className="space-y-4">
                        {events.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-icons-outlined text-gray-300 text-3xl">event_busy</span>
                                </div>
                                <h3 className="text-gray-900 font-medium">No hay eventos próximos</h3>
                                <p className="text-gray-500 text-sm mt-1">Mantente atento a las notificaciones.</p>
                            </div>
                        ) : (
                            events.map(event => (
                                <div key={event.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/30 transition-all group">
                                    {/* Date Box */}
                                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-orange-50 text-orange-600 rounded-xl shrink-0">
                                        <span className="text-xs font-bold uppercase">{format(new Date(event.date), 'MMM', { locale: es })}</span>
                                        <span className="text-xl font-bold">{format(new Date(event.date), 'd')}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-gray-900 text-lg">{event.title}</h4>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full uppercase">
                                                {event.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{event.description}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                                            <div className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-[16px]">schedule</span>
                                                {format(new Date(event.startTime), 'h:mm a')}
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-icons-outlined text-[16px]">place</span>
                                                    {event.location}
                                                </div>
                                            )}
                                            {event.user && (
                                                <div className="flex items-center gap-1 ml-auto text-gray-500">
                                                    <span className="material-icons-outlined text-[16px]">person</span>
                                                    Creado por: {event.user.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Reservations List */}
                {activeTab === 'reservations' && (
                    <div className="space-y-4">
                        {reservations.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-icons-outlined text-gray-300 text-3xl">bookmark_border</span>
                                </div>
                                <h3 className="text-gray-900 font-medium">Sin reservas activas</h3>
                                <p className="text-gray-500 text-sm mt-1">Reserva una amenidad desde el calendario.</p>
                            </div>
                        ) : (
                            reservations.map(res => (
                                <div key={res.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/30 transition-all">
                                    {/* Icon Box */}
                                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                                        <span className="material-icons-outlined text-2xl">
                                            {res.amenity.name.includes('Piscina') ? 'pool' :
                                                res.amenity.name.includes('BBQ') ? 'outdoor_grill' :
                                                    res.amenity.name.includes('Gimnasio') ? 'fitness_center' : 'meeting_room'}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-gray-900">{res.amenity.name}</h4>
                                            <span className={`px-2 py-1 text-[10px] font-medium rounded-full uppercase
                                                ${res.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                            `}>
                                                {res.status === 'Confirmed' ? 'Confirmada' : res.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-[16px] text-gray-400">calendar_today</span>
                                                {format(new Date(res.date), 'd MMM yyyy', { locale: es })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-[16px] text-gray-400">schedule</span>
                                                {format(new Date(res.startTime), 'h:mm a')} - {format(new Date(res.endTime), 'h:mm a')}
                                            </div>
                                            {isStaff && res.user && (
                                                <div className="flex items-center gap-1 ml-auto text-blue-600 font-medium">
                                                    <span className="material-icons-outlined text-[16px]">account_circle</span>
                                                    {res.user.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
