'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerMember, getBuildingOptions } from '../lib/actions';

export default function RegisterPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [buildings, setBuildings] = useState<any[]>([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | string>('');
    const [availableUnits, setAvailableUnits] = useState<any[]>([]);

    useEffect(() => {
        getBuildingOptions().then(res => {
            if (res.success) {
                setBuildings(res.data);
            }
        });
    }, []);

    // Filter units when building changes
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

        // Append family members as JSON
        formData.append('familyMembers', JSON.stringify(familyMembers));

        startTransition(async () => {
            const result = await registerMember(null, formData);
            if (result.success) {
                router.push('/login');
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-700">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#1A4373] px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wide">Member Registration</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {/* Section 1: Building Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Building Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Select Building</label>
                                    <select
                                        name="buildingId"
                                        onChange={handleBuildingChange}
                                        value={selectedBuildingId}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50"
                                    >
                                        <option value="">Select Building</option>
                                        {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Select Unit Category</label>
                                    <select name="unitCategory" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50">
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Select Unit Name</label>
                                    <select name="unitId" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50">
                                        <option value="">Select Unit Name</option>
                                        {availableUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Owner</label>
                                    <select name="status" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50">
                                        <option value="Owner">Owner</option>
                                        <option value="Tenant">Tenant</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Occupied By</label>
                                    <select name="occupiedBy" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50">
                                        <option value="Owner">Owner</option>
                                        <option value="Tenant">Tenant</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Occupied Date*</label>
                                    <input type="date" name="occupiedDate" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50" required />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Member Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Member Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">First Name*</label>
                                    <input type="text" name="firstName" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Middle Name</label>
                                    <input type="text" name="middleName" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Last Name*</label>
                                    <input type="text" name="lastName" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth*</label>
                                    <input type="date" name="dob" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Gender*</label>
                                    <div className="flex space-x-4 mt-2">
                                        <label className="inline-flex items-center">
                                            <input type="radio" name="gender" value="Male" className="form-radio text-[#1A4373] focus:ring-[#1A4373]" defaultChecked />
                                            <span className="ml-2">Male</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input type="radio" name="gender" value="Female" className="form-radio text-[#1A4373] focus:ring-[#1A4373]" />
                                            <span className="ml-2">Female</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Email*</label>
                                    <input type="email" name="email" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Password*</label>
                                    <input type="password" name="password" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50" required />
                                </div>
                                <div className="flex space-x-4">
                                    <div className="w-1/4">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Code*</label>
                                        <input type="text" name="countryCode" defaultValue="+1" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50" />
                                    </div>
                                    <div className="w-3/4">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Number*</label>
                                        <input type="tel" name="mobileNumber" className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50" required />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                    <textarea name="address" rows={2} className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50"></textarea>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Image</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A4373]">
                                            Choose File
                                            <input type="file" name="image" className="hidden" accept="image/*" />
                                        </label>
                                        <span className="text-sm text-gray-500">No file chosen</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Family Information */}
                        <div>
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h3 className="text-lg font-semibold text-gray-800">Family Information</h3>
                                <button type="button" onClick={addFamilyMember} className="bg-[#1A4373] text-white p-1 rounded-md hover:bg-[#15365d] transition-colors">
                                    <span className="material-icons-outlined text-lg">add</span>
                                </button>
                            </div>

                            {familyMembers.map((member, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200 relative">
                                    <button type="button" onClick={() => removeFamilyMember(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                        <span className="material-icons-outlined">close</span>
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => handleFamilyChange(index, 'name', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Relation</label>
                                            <input
                                                type="text"
                                                value={member.relation}
                                                onChange={(e) => handleFamilyChange(index, 'relation', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={member.dob}
                                                onChange={(e) => handleFamilyChange(index, 'dob', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A4373] focus:ring focus:ring-[#1A4373] focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                                            <div className="flex space-x-4 mt-2">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={`family_gender_${index}`}
                                                        checked={member.gender === 'Male'}
                                                        onChange={() => handleFamilyChange(index, 'gender', 'Male')}
                                                        className="form-radio text-[#1A4373] focus:ring-[#1A4373]"
                                                    />
                                                    <span className="ml-2">Male</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={`family_gender_${index}`}
                                                        checked={member.gender === 'Female'}
                                                        onChange={() => handleFamilyChange(index, 'gender', 'Female')}
                                                        className="form-radio text-[#1A4373] focus:ring-[#1A4373]"
                                                    />
                                                    <span className="ml-2">Female</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {familyMembers.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No family members added.</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-[#1A4373] text-white font-bold py-3 px-4 rounded-md shadow hover:bg-[#15365d] focus:outline-none focus:ring-2 focus:ring-[#1A4373] focus:ring-offset-2 transition-transform transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending ? 'REGISTERING...' : 'MEMBER REGISTRATION'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
