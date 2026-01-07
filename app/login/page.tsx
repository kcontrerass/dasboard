'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call and set cookie
        // In a real app, this would be a Server Action or API route
        document.cookie = "auth_token=true; path=/; max-age=86400"; // 1 day

        // Smooth transition
        setTimeout(() => {
            router.push('/');
            router.refresh();
        }, 1000);
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4" style={{ backgroundColor: '#0d2c4b' }}>
            <div className="absolute inset-0">
                <img
                    alt="Abstract blue background shapes"
                    className="h-full w-full object-cover opacity-20"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuANqrrW6t9-pxO0dYTjHmdauWvYP4j8HO2Ei33WJXphD0SVamfCHgJvnKs5ynthkXro_i5rZ_EI4YXobK1HPQGBGdNQlC9qEwedWX94jOLTQ5cpC-061L3tsVwvXi8u9yXKVhc3coSkN-wlIDA22rvnweQYRe7LQE7tzV1A2IqMwBxcUzHwy3_pmKNiMWJs50EI3khMmSMPn3QxqTBynjEmSwZr-p8_mlhqmA8QUimF9Q8nHRrKYzNIzmMQAoJrbYVwXHpWFKKZWXoe"
                />
            </div>

            <div className="relative w-full max-w-6xl rounded-lg bg-white shadow-lg overflow-hidden flex flex-col">
                {/* Header Ribbon */}
                <div className="bg-[#1A4373] text-white p-4 flex justify-center items-center relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block">
                        <img
                            alt="Badge icon"
                            className="h-16 w-16"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9tYSmFLCwlmQ57OMBrbKuXHVxJkgC4kBpe8tDRMNElHOBYBthn5I9m5KzSM-gRdzkZ1ahmhOrgHJNm68MAF_n7hrzGDcoxYQ_HYKrZBDooEWG1PWnQz9q7SwP8GYsKBfVb_N6vNUJTuD-Z55K06bTg44dL7aYAh-R3pGSd9ndJdRdvIiZ_Dh-kdRyikoKOpzRBKzg9nzWflRJPD_r7up6RR2R5Y2q7kDmOHlVcxIG0Hsht7U3qFDIgPYOQxelSTJHIR5P46ZVmp8D"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold">Most Trusted Apartment Plugin</h1>
                        <p className="text-xs md:text-sm text-blue-200">#1 Selling Plugin on Codecanyon</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Sidebar Area */}
                    <aside className="w-full md:w-1/4 bg-white p-6 space-y-4 border-r border-gray-200 flex flex-col items-center">
                        <div className="text-center mb-6">
                            <img
                                alt="MJ AMS Logo"
                                className="mx-auto h-16 w-16 mb-2"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEe4owP0fS_y5BTl0tolxPpkvlmR35BM8q7bq6Zqj74fxjPUdUjcF2IHgPLaVdTrn0yUibZ9Q5kPg3GvqfONEkD-iEK5AYmnk0k2x5Z7lhz2jhCOj4b23SBdhkYL-Uha9Fhqs7QLow5024rVE81E46wwj9du6ES20Ev0lfzUEtRuPHFAOujDy_vLIacDosT902RXEqgLRxLzJZ6WvQXGEr_Z3qbxwrDvGt8F9lPDTrjoGbN6y6hjlQxS9jT8vQDqNSmemwA0WxiHXu"
                            />
                            <h2 className="text-xl font-bold text-[#1A4373]">MJ AMS</h2>
                            <p className="text-sm text-gray-500">Apartment Management System</p>
                        </div>

                        <nav className="space-y-2 w-full">
                            <a className="flex items-center justify-between rounded-md bg-[#1A4373] px-4 py-3 text-white font-medium shadow-md transition-transform active:scale-95" href="#">
                                <span>Apartment Management Login</span>
                                <span className="bg-white w-2 h-2 rounded-full"></span>
                            </a>
                            <a className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-3 text-gray-600 hover:bg-gray-200 font-medium transition-colors" href="#">
                                <span>Member Registration Page</span>
                            </a>
                            <a className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-3 text-gray-600 hover:bg-gray-200 font-medium transition-colors" href="#">
                                <span>Apartment Society Rules</span>
                            </a>
                        </nav>

                        <div className="pt-8 hidden md:block">
                            <img
                                alt="decorative plant"
                                className="h-32 mx-auto object-contain"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf6k8GMA_MLWEW1y3c2cAS_Li7Qo0E2QnArf_ZNBujR_gIIaFtlT4ZQUinZQoxkh2QNmlS7zaL418txq1s78TQVhFqDzMHb6Zh1XfhTjQTzdPbM5El5qEB2NGFHzEhZgHDhh7u8gyYdEUbefakWfs-3MKQEFjvFgbx7os-1-YBP4GIiNS6_qrf_VSwoGOxoSWUgVWvOgRBHNivAoRXm7RNx3Q5Xzm6ZLD7Q1jkT_CVB22R_RZ52ZL9EukWuRTlSZthEvBDUWHkAPHS"
                            />
                        </div>
                    </aside>

                    {/* Main Form Area */}
                    <main className="w-full md:w-3/4 p-8 md:p-12 relative">
                        <form onSubmit={handleLogin} className="max-w-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email ID</label>
                                    <input
                                        className="w-full border-0 border-b-2 border-gray-300 focus:border-[#1A4373] focus:ring-0 px-0 py-2 bg-transparent transition-colors outline-none"
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                                    <input
                                        className="w-full border-0 border-b-2 border-gray-300 focus:border-[#1A4373] focus:ring-0 px-0 py-2 bg-transparent transition-colors outline-none"
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center">
                                    <input
                                        className="h-4 w-4 rounded text-[#1A4373] focus:ring-[#1A4373] border-gray-300"
                                        id="remember-me"
                                        type="checkbox"
                                    />
                                    <label className="ml-2 text-sm text-gray-600" htmlFor="remember-me">Remember Me</label>
                                </div>
                                <a href="#" className="text-sm text-[#1A4373] hover:underline">Forgot Password?</a>
                            </div>

                            <div className="mb-10">
                                <button
                                    className={` rounded-md bg-[#1A4373] px-10 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#15365d] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'LOGGING IN...' : 'LOG IN'}
                                </button>
                            </div>
                        </form>

                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <span className="text-gray-600 mr-2 font-medium">Or Login As</span>
                                <span className="material-icons-outlined text-gray-500 text-sm">arrow_downward</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {[
                                    { name: 'Member', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzqeVtt5QbcA7gOiX-6rHNmAtBsC8eCwp2MG9MYx-IH2YMyqkVtS28CjWktTeJOygH4xUwVy_FuAraUjdp_wLq-2meV-YjWob4pf9uiqyEKNu1xSJNwF4JOMptHY8kDtU0KXTwk-xCQdncSlysLoG8aZL9ZoofjSJ7bDoJ14sSXfcXj14qHkoTpYV9kv8fjog9qXreAQVWk5oTQ2Vyv-8fvRu5H0In8yY3bcvBdVdcqvZY-q4aTeE6cQoWHm6y0xFVK0mkWsvDyhS7' },
                                    { name: 'Accountant', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpHcmIO6HpGU_LKogFNACSfNswWXhewHJsRvTp7UOfQPXYtLC3vTb-Ea3kz5RmonrDlQzE5L61sZ_vhy2ebaBfjV11-XUnhQMal-VnSpoVYD7Ye6mnSmBGPOfm1K60K6imDZPc3pVFwR4JLlrQItFfWubJyZT_9O5CcexV1976VO7xpDcsa2tJjtxDLdTu8bo3JPvQZjmod--QvzxFvygZ6uTYo6VGlRRUdcmhd_2sQGsJuB6WDenr5w6g6YPYVudL5OCo3E_PWzMQ' },
                                    { name: 'Staff', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD24_fShj-eHbPTMT3wBxi0tqykXBGYflhVkajO-o_O8DHqdEoAaobj6ZukGOofhIENuwVq3vFX48yqwaj_UC8hmgAkfxRWZaxLASNUcFje5SpdJ5Qrq-dsFZK5GImjrkRsqcLIgVJVsg_khb6gF208uEHslUUA4DUIc2QTy_ZVwrBM-rNXsx0jpp1b6prxLhpj_VZqL2Rh2Etr3EUUIgs6nwOh3HKsVepn56P4N7sXjjLMTNayaXgjpeG4AjLkoWj5rTMPwCQqbsK6' },
                                    { name: 'Gatekeeper', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0wZdv-hR85LIbp5N0hO_WQ9RYgQE6E-TigP7rfr2kDfjVWLvbilC2a57Z4KAPJWIJi1qkZePwvSXXB8GO3Ma60QciJkQJh6nLbACsG-9SEB-8-sJNh9S-wh6kaF90JyAeYkpTgDIizuTU2k8N8MtfKBQKpUNJvc8vjkIf-1ItGzDVaX5x7R6DEZu-_P_PphPydsFIL1uR_g0YVNaVhVs9zCjF0twK8iPqVoLxBpcRa97pbCoChEvNBbJd4a7x7WCWQA7Gkw0kf3zU' },
                                    { name: 'Super Admin', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1RLdW3PXBPmUn4XZGUWaXMSLfR041q0UCVhuH4MN6dLNsKERczTAR0Ms1UPWvtOmLwHv6XLula3MYwxCik3oZHd2nZmVgi0GURKGVcJwA-ZIpiPm9EMo2aTW_HT3TQjjys-EmnMBNl-nDhnZPDTF19CKxjye6HtY8k9gIw4s32JwqR10m-OVazRoOqSeDNnsjVOG9hFFYXD3L4loVdMwO2jYLUBIR6ISe8A5_QPfZSmJS_s3jpOsTJ0DDqLvni_hPjdfytbrl7jNU' },
                                ].map((role) => (
                                    <div key={role.name} onClick={handleLogin} className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-[#1A4373] cursor-pointer group">
                                        <img alt={`${role.name} Icon`} className="h-10 w-10 group-hover:scale-110 transition-transform" src={role.icon} />
                                        <span className="text-sm font-medium text-gray-700">{role.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <button className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors flex items-center">
                                <span className="material-icons-outlined text-gray-400 mr-2 text-lg">help_outline</span>
                                Help Document
                            </button>
                        </div>

                        <div className="absolute bottom-4 right-4 hidden lg:block">
                            <img
                                alt="Brand Logo"
                                className="h-16 w-16 opacity-80"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqfkx6Cuu7sf5jCaLAF6qq5A2rPRdcyznyuULbY-OBaCVRx_EoHFlC37uqWKMf7jg-0yBe61eGVfMq1wV-xZ1W9tRHGEMv6Gti--SYJ9IxWfaPqBgRvLQ9ulQW9ZzeAjp5a-kOmwDwCGbj3k_00ZiC5WaI_6VwcqVzeblOjCHYqpwuQIksfxhit_ESgg4iq4diSvhuRy1N8db2efIhJkv6VuNS2jf1g0Tf5kpFmy3QPXfj-lDhjDOC50EPqb0AWPvvM13P9oDxG7Gx"
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
