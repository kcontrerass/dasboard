import VisitorsWidget from '../components/dashboard/VisitorsWidget';
import NoticesWidget from '../components/dashboard/NoticesWidget';
import InvoicesWidget from '../components/dashboard/InvoicesWidget';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import MessagesWidget from '../components/dashboard/MessagesWidget';
import { getDashboardStats, getNotices, getInvoices, getMessages, getUsers } from '../lib/actions';

export default async function Home() {
  const stats = await getDashboardStats();
  const noticesRes = await getNotices();
  const invoicesRes = await getInvoices();
  const messagesRes = await getMessages();
  const usersRes = await getUsers();

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorsWidget totalVisitors={stats.visitorsCount} />
        <NoticesWidget notices={noticesRes.data} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InvoicesWidget invoices={invoicesRes.data} />
        <CalendarWidget />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <NoticesWidget notices={noticesRes.data} /> {/* Reusing notices widget */}
        <MessagesWidget messages={messagesRes.data} users={usersRes.data} />
      </div>
      <footer className="text-center text-xs text-gray-400 py-4">
        Copyright ©2026 Aumenta System. Todos los derechos reservados.
      </footer>
    </main>
  );
}
