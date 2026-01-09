'use client';

import { useState, useEffect } from 'react';
import { createReservation, createEvent, getAmenities } from '../../lib/actions';
import { useActionState } from 'react';

type ActionState = {
    success: boolean;
    message: string;
    data?: any;
} | null;

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date | null;
}

const initialState: ActionState = null;

export default function BookingModal({ isOpen, onClose, selectedDate }: BookingModalProps) {
    const [activeTab, setActiveTab] = useState<'reservation' | 'event'>('reservation');
    const [amenities, setAmenities] = useState<any[]>([]);

    // Action states
    const [resState, resAction, resPending] = useActionState(createReservation, initialState);
    const [eventState, eventAction, eventPending] = useActionState(createEvent, initialState);

    // Fetch amenities on mount
    useEffect(() => {
        if (isOpen) {
            getAmenities().then(res => {
                if (res.success) setAmenities(res.data);
            });
        }
    }, [isOpen]);

    // Close on success
    useEffect(() => {
        if (resState?.success || eventState?.success) {
            const timer = setTimeout(() => {
                onClose();
                // Reset states? Difficult with useActionState, but component unmounts usually help
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [resState, eventState, onClose]);

    if (!isOpen || !selectedDate) return null;

    const formattedDate = selectedDate.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">
                        {activeTab === 'reservation' ? 'Reservar Amenidad' : 'Crear Evento'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('reservation')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'reservation' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Reservar
                    </button>
                    <button
                        onClick={() => setActiveTab('event')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'event' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Evento (Admin)
                    </button>
                </div>

                <div className="p-6">
                    {/* Reservation Form */}
                    {activeTab === 'reservation' && (
                        <div>
                            {resState?.success ? (
                                <div className="text-center py-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                                        <span className="material-icons-outlined">check</span>
                                    </div>
                                    <p className="text-green-600 font-medium">{resState.message}</p>
                                </div>
                            ) : (
                                <form action={resAction} className="space-y-4">
                                    <input type="hidden" name="date" value={formattedDate} />

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Amenidad</label>
                                        <select name="amenityId" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary">
                                            <option value="">Seleccionar...</option>
                                            {amenities.map(a => (
                                                <option key={a.id} value={a.id}>{a.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Hora Inicio</label>
                                            <input type="time" name="startTime" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Hora Fin</label>
                                            <input type="time" name="endTime" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                                        </div>
                                    </div>

                                    {resState?.success === false && <p className="text-xs text-red-500">{resState.message}</p>}

                                    <button
                                        type="submit"
                                        disabled={resPending}
                                        className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                                    >
                                        {resPending && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                        Confirmar Reserva
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Event Form */}
                    {activeTab === 'event' && (
                        <div>
                            {eventState?.success ? (
                                <div className="text-center py-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                                        <span className="material-icons-outlined">check</span>
                                    </div>
                                    <p className="text-green-600 font-medium">{eventState.message}</p>
                                </div>
                            ) : (
                                <form action={eventAction} className="space-y-4">
                                    <input type="hidden" name="date" value={formattedDate} />

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
                                        <input type="text" name="title" required placeholder="Ej. Reunión General" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
                                        <textarea name="description" rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Hora (Opcional)</label>
                                        <input type="time" name="startTime" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                                    </div>

                                    {eventState?.success === false && <p className="text-xs text-red-500">{eventState.message}</p>}

                                    <button
                                        type="submit"
                                        disabled={eventPending}
                                        className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                                    >
                                        {eventPending && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                        Crear Evento
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
