'use client';

import { useState } from 'react';
import { createVisitor } from '../../lib/actions';
import { useActionState } from 'react';

// Define the action state type explicitly
type ActionState = {
    success: boolean;
    message: string;
    data?: any;
} | null; // Allow null as initial state

interface CreateVisitorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialState: ActionState = null;

export default function CreateVisitorModal({ isOpen, onClose }: CreateVisitorModalProps) {
    // Correctly type the useActionState
    const [state, formAction, isPending] = useActionState(createVisitor, initialState);

    // Close modal on success effect could be added, but for simplicity we rely on manual close or "Done" state

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">Registrar Visita</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                <div className="p-6">
                    {state?.success ? (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                                <span className="material-icons-outlined">check</span>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">Registrado Correctamente</h4>
                            <p className="text-sm text-gray-500 mb-6">{state.message}</p>
                            <button
                                onClick={onClose}
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-xs font-medium text-gray-700 mb-1">Tipo de Visita</label>
                                <select
                                    name="type"
                                    id="type"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                >
                                    <option value="Guest">Invitado (Guest)</option>
                                    <option value="Delivery">Domicilio (Delivery)</option>
                                    <option value="Contractor">Contratista (Contractor)</option>
                                    <option value="Other">Otro</option>
                                </select>
                            </div>

                            {state?.success === false && (
                                <p className="text-xs text-red-500 mt-2">{state.message}</p>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <>
                                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            <span>Guardando...</span>
                                        </>
                                    ) : (
                                        'Registrar Entrada'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
