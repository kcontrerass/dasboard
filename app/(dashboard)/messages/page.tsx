'use client';

import { useState, useEffect, useTransition } from 'react';
import { useActionState } from 'react';
import { sendMessage, getUsers, getMessages } from '../../lib/actions';

const initialState = {
    message: '',
    success: false,
};

export default function MessagesPage() {
    const [state, formAction, isPending] = useActionState(sendMessage, initialState);
    const [users, setUsers] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    // Using simple state fetch inside useEffect for client component demo 
    // In a real app, strict server component separation is better, but this is a quick client page.

    useEffect(() => {
        getUsers().then(res => {
            if (res.success && res.data) setUsers(res.data);
        });

        getMessages().then(res => {
            if (res.success && res.data) setMessages(res.data);
        });
    }, [state.success]); // Refresh when message sent (or just let revalidatePath handle it if using server components)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Mensajería</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Send Message Form --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Enviar Mensaje</h2>

                    <form action={formAction} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Destinatario</label>
                            <select
                                name="receiverId"
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]"
                                required
                            >
                                <option value="">Seleccionar Usuario</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                            <textarea
                                name="content"
                                rows={4}
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]"
                                placeholder="Escribe tu mensaje aquí..."
                                required
                            ></textarea>
                        </div>

                        {state.message && (
                            <div className={`p-3 rounded text-sm ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {state.message}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-[#1A4373] text-white font-bold py-2.5 rounded-lg hover:bg-[#15365d] transition-colors disabled:opacity-50"
                            >
                                {isPending ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Inbox --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Bandeja de Entrada</h2>

                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <p className="text-gray-500 text-sm">No tienes mensajes recibidos.</p>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-sm font-bold text-gray-800">{msg.sender?.name || 'Desconocido'}</h3>
                                        <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">
                                        {msg.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
