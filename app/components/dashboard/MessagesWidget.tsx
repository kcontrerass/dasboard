import Link from 'next/link';
import { sendMessageAction } from '../../lib/actions';

interface MessagesWidgetProps {
    messages: any[];
    users: any[]; // list of possible recipients
}

export default function MessagesWidget({ messages = [], users = [] }: MessagesWidgetProps) {
    return (
        <div className="bg-card-light rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Mensajes</h2>
                {/* The link to a separate page is removed; we keep the icon for consistency */}
                <Link href="/messages" className="text-gray-400 hover:text-blue-500 transition-colors">
                    <span className="material-icons-outlined text-lg">open_in_new</span>
                </Link>
            </div>
            {/* List of received messages */}
            <div className="space-y-5">
                {messages.map((message) => (
                    <div key={message.id} className="flex items-start justify-between">
                        <div className="flex items-start">
                            <div
                                className={`${message.avatarColor || 'bg-blue-500'} rounded-full h-10 w-10 flex items-center justify-center text-white flex-shrink-0 mr-3`}
                            >
                                <span className="material-icons-outlined">chat_bubble_outline</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">{message.sender?.name || 'Desconocido'}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{message.content}</p>
                            </div>
                        </div>
                        <span className="bg-gray-200 text-gray-600 text-[10px] font-medium px-2 py-1 rounded w-20 text-center">
                            {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
            {/* Send new message form */}
            <form action={sendMessageAction} className="mt-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destinatario</label>
                    <select name="receiverId" className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-700">
                        <option value="">Selecciona un usuario</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>{u.name || u.email}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                    <textarea name="content" rows={3} className="block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 text-gray-700" required></textarea>
                </div>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                    Enviar Mensaje
                </button>
            </form>
        </div>
    );
}
