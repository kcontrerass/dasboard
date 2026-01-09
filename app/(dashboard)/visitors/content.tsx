'use client';

import { useState } from 'react';
import VisitorTable from '../../components/visitors/VisitorTable';
import CreateVisitorModal from '../../components/visitors/CreateVisitorModal';

// Simplified page component that separates data passing from UI state
export default function VisitorsContent({ visitors }: { visitors: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Control de Visitas</h1>
                        <p className="text-gray-500 text-sm mt-1">Gestiona el acceso de visitantes y proveedores.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        <span className="material-icons-outlined text-[18px]">add</span>
                        Registrar Visita
                    </button>
                </div>

                <VisitorTable visitors={visitors} />

                <CreateVisitorModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </main>
    );
}
