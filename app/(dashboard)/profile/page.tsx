export default function Profile() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
                <span className="material-icons-outlined text-6xl mb-4 text-gray-300">person</span>
                <p className="text-lg">User profile settings.</p>
            </div>
        </div>
    );
}
