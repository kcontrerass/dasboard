import { getUserProfile } from '../../lib/actions';

export default async function ProfilePage() {
    const profileRes = await getUserProfile();

    if (!profileRes?.success || !profileRes.data) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <span className="material-icons-outlined text-4xl text-gray-400 mb-2">error_outline</span>
                    <p className="text-gray-600">Profile not found. Please log in.</p>
                </div>
            </div>
        );
    }

    const user = profileRes.data;
    const member = user.memberProfile;
    const unit = member?.unit;
    const building = unit?.building;

    return (
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Personal Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-24 bg-[#1A4373]"></div>
                        <div className="px-6 pb-6 relative">
                            <div className="relative -top-12 mb-[-3rem] flex justify-center">
                                <img
                                    src={user.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCHBORfy9k2aZMB96PxYlf67MYlxni-VWmSTcbyMm0kdGSK5BXONq1p7YHUau3RN5Vey6enSDiKbbLsYXB_QAze4ulTyzjtiGo8ZJRhz-C3A2jnoh0Fr1k9fq5P1CjSL1xUS4I3jBvR7g1F6AGu8DiyNRB2VLsMTu4gxkq10bLrY7Egp5HqE97dRFgc2rjTyq5Q4I1ksY5_NZGdrtUz2P0QnbyXwnthIBJm9Sss3aKAnTHSjtQO9L5KA7bvXagoG-adyYY2QILypa49"}
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full border-4 border-white object-cover bg-white shadow-md"
                                />
                            </div>
                            <div className="mt-14 text-center">
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mt-1">{user.role}</p>
                            </div>

                            <div className="mt-6 space-y-3 border-t pt-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="material-icons-outlined mr-3 text-[#1A4373]">email</span>
                                    <span>{user.email}</span>
                                </div>
                                {member && (
                                    <>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="material-icons-outlined mr-3 text-[#1A4373]">phone</span>
                                            <span>{member.mobileNumber}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="material-icons-outlined mr-3 text-[#1A4373]">cake</span>
                                            <span>{new Date(member.dob).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="material-icons-outlined mr-3 text-[#1A4373]">badge</span>
                                            <span>{member.gender}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Residence & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Residence Info */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                            <span className="material-icons-outlined mr-2 text-[#1A4373]">apartment</span>
                            Residence Information
                        </h3>

                        {unit ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Building Name</p>
                                    <p className="font-medium text-gray-900">{building?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Unit Number</p>
                                    <p className="font-medium text-gray-900">{unit.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Unit Category</p>
                                    <p className="font-medium text-gray-900">{unit.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member?.status === 'Owner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {member?.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Occupied Since</p>
                                    <p className="font-medium text-gray-900">{member?.occupiedDate ? new Date(member.occupiedDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                                No residence unit assigned.
                            </div>
                        )}
                    </div>

                    {/* Family Members */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                            <span className="material-icons-outlined mr-2 text-[#1A4373]">family_restroom</span>
                            Family Members
                        </h3>

                        {user.familyMembers && user.familyMembers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relation</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {user.familyMembers.map((fm: any) => (
                                            <tr key={fm.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fm.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fm.relation}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fm.gender}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(fm.dob).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No family members registered.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
