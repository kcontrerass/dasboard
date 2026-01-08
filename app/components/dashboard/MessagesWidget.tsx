interface MessagesWidgetProps {
    messages: any[];
}

export default function MessagesWidget({ messages = [] }: MessagesWidgetProps) {
    return (
        <div className="bg-card-light rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Messages</h2>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <span className="material-icons-outlined text-lg">open_in_new</span>
                </button>
            </div>
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
                                <h4 className="text-sm font-semibold text-gray-900">{message.sender?.name || 'Unknown'}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{message.content}</p>
                            </div>
                        </div>
                        <span className="bg-gray-200 text-gray-600 text-[10px] font-medium px-2 py-1 rounded w-20 text-center">
                            {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
