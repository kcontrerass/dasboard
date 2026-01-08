interface InvoicesWidgetProps {
    invoices: any[];
}

export default function InvoicesWidget({ invoices = [] }: InvoicesWidgetProps) {
    return (
        <div className="bg-card-light rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Invoices</h2>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <span className="material-icons-outlined text-lg">open_in_new</span>
                </button>
            </div>
            <div className="space-y-4">
                {invoices.map((invoice, index) => {
                    let iconColor = 'bg-gray-100 text-gray-600';
                    if (invoice.category.toLowerCase().includes('water')) iconColor = 'bg-teal-100 text-teal-600';
                    if (invoice.category.toLowerCase().includes('electricity')) iconColor = 'bg-yellow-100 text-yellow-600';
                    if (invoice.category.toLowerCase().includes('maintenance')) iconColor = 'bg-orange-100 text-orange-600';

                    return (
                        <div key={`${invoice.id}-${index}`} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`${iconColor} p-2 rounded-lg mr-3`}>
                                    <span className="material-icons-outlined text-xl">payments</span>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-1">
                                        <p className="text-xs font-semibold text-gray-900">{invoice.id}</p>
                                        <span className="text-xs text-blue-600 font-bold">${invoice.amount}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 flex items-center mt-0.5">
                                        <span className="material-icons-outlined text-[10px] mr-1">person</span>{' '}
                                        {invoice.user?.name || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] px-3 py-1 rounded-full font-medium ${invoice.status === 'Paid' || invoice.status === 'Fully Paid'
                                    ? 'bg-green-100 text-green-600 w-16 text-center'
                                    : 'bg-red-100 text-red-600'
                                    }`}
                            >
                                {invoice.status}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
