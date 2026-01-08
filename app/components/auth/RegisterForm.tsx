'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerMember, getBuildingOptions } from '../../lib/actions';

interface RegisterFormProps {
    onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [buildings, setBuildings] = useState<any[]>([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | string>('');
    const [availableUnits, setAvailableUnits] = useState<any[]>([]);

    useEffect(() => {
        getBuildingOptions().then(res => {
            if (res.success && res.data) {
                setBuildings(res.data);
            }
        });
    }, []);

    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const buildId = Number(e.target.value);
        setSelectedBuildingId(buildId);
        const building = buildings.find(b => b.id === buildId);
        setAvailableUnits(building ? building.units : []);
    };

    const [familyMembers, setFamilyMembers] = useState<{ name: string; dob: string; gender: string; relation: string }[]>([]);

    const addFamilyMember = () => {
        setFamilyMembers([...familyMembers, { name: '', dob: '', gender: 'Male', relation: '' }]);
    };

    const removeFamilyMember = (index: number) => {
        const newMembers = [...familyMembers];
        newMembers.splice(index, 1);
        setFamilyMembers(newMembers);
    };

    const handleFamilyChange = (index: number, field: string, value: string) => {
        const newMembers = [...familyMembers];
        // @ts-ignore
        newMembers[index][field] = value;
        setFamilyMembers(newMembers);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        formData.append('familyMembers', JSON.stringify(familyMembers));

        startTransition(async () => {
            const result = await registerMember(null, formData);
            if (result.success) {
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/login');
                }
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <div className="md:col-span-2 bg-white p-8 md:p-12 relative">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Registro de Miembro</h2>
                <p className="text-gray-500 text-sm mt-1">Completa los detalles para crear tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm mb-6" role="alert">
                        <span>{error}</span>
                    </div>
                )}

                {/* --- User Type Selection --- */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center">
                        <span className="material-icons-outlined text-base mr-2">badge</span>
                        Tipo de Cuenta
                    </h3>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Usuario</label>
                        <select name="role" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]">
                            <option value="MEMBER">Miembro</option>
                            <option value="ACCOUNTANT">Contador</option>
                            <option value="STAFF">Personal</option>
                            <option value="GATEKEEPER">Vigilante</option>
                        </select>
                    </div>
                </div>

                {/* --- Building Info --- */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center">
                        <span className="material-icons-outlined text-base mr-2">apartment</span>
                        Información del Edificio
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Edificio</label>
                            <select
                                name="buildingId"
                                onChange={handleBuildingChange}
                                value={selectedBuildingId}
                                className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]"
                            >
                                <option value="">Seleccionar Edificio</option>
                                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Unidad</label>
                            <select name="unitId" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]">
                                <option value="">Seleccionar Unidad</option>
                                {availableUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
                            <select name="status" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]">
                                <option value="Owner">Propietario</option>
                                <option value="Tenant">Inquilino</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de Ocupación</label>
                            <input type="date" name="occupiedDate" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]" required />
                        </div>
                    </div>
                </div>

                {/* --- Personal Info --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre*</label>
                        <input type="text" name="firstName" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]" required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Apellido*</label>
                        <input type="text" name="lastName" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]" required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Email*</label>
                        <input type="email" name="email" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]" required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña*</label>
                        <input type="password" name="password" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]" required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de Nacimiento*</label>
                        <input type="date" name="dob" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]" required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Móvil*</label>
                        <input type="tel" name="mobileNumber" className="w-full rounded border-gray-300 text-sm focus:border-[#1A4373] focus:ring-[#1A4373]" required />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Género</label>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input type="radio" name="gender" value="Male" className="form-radio text-[#1A4373]" defaultChecked />
                                <span className="ml-2 text-sm">Masculino</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="gender" value="Female" className="form-radio text-[#1A4373]" />
                                <span className="ml-2 text-sm">Femenino</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* --- Family Info --- */}
                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase flex items-center">
                            <span className="material-icons-outlined text-base mr-2">family_restroom</span>
                            Miembros de la Familia
                        </h3>
                        <button type="button" onClick={addFamilyMember} className="text-[#1A4373] text-sm hover:underline font-medium">
                            + Agregar Miembro
                        </button>
                    </div>

                    {familyMembers.map((member, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded mb-2 border border-gray-200 relative grid grid-cols-1 md:grid-cols-3 gap-2">
                            <button type="button" onClick={() => removeFamilyMember(index)} className="absolute top-1 right-1 text-gray-400 hover:text-red-500">
                                <span className="material-icons-outlined text-sm">close</span>
                            </button>
                            <input
                                placeholder="Nombre"
                                type="text"
                                value={member.name}
                                onChange={(e) => handleFamilyChange(index, 'name', e.target.value)}
                                className="w-full rounded border-gray-300 text-xs py-1"
                            />
                            <input
                                placeholder="Parentesco"
                                type="text"
                                value={member.relation}
                                onChange={(e) => handleFamilyChange(index, 'relation', e.target.value)}
                                className="w-full rounded border-gray-300 text-xs py-1"
                            />
                            <select
                                value={member.gender}
                                onChange={(e) => handleFamilyChange(index, 'gender', e.target.value)}
                                className="w-full rounded border-gray-300 text-xs py-1"
                            >
                                <option value="Male">Masculino</option>
                                <option value="Female">Femenino</option>
                            </select>
                            <input
                                type="date"
                                value={member.dob}
                                onChange={(e) => handleFamilyChange(index, 'dob', e.target.value)}
                                className="w-full rounded border-gray-300 text-xs py-1 col-span-1 md:col-span-3"
                            />
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#1A4373] text-white font-bold py-3 px-4 rounded shadow hover:bg-[#15365d] transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'CREANDO CUENTA...' : 'REGISTRAR CUENTA'}
                    </button>
                </div>
            </form>
        </div>
    );
}
