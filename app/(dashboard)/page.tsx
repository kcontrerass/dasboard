import VisitorsWidget from '../components/dashboard/VisitorsWidget';
import NoticesWidget from '../components/dashboard/NoticesWidget';
import InvoicesWidget from '../components/dashboard/InvoicesWidget';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import MessagesWidget from '../components/dashboard/MessagesWidget';

export default function Home() {
  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorsWidget />
        <NoticesWidget />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InvoicesWidget />
        <CalendarWidget />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <NoticesWidget /> {/* Reusing notices widget as per design or could be separate component if data differs */}
        <MessagesWidget />
      </div>
      <footer className="text-center text-xs text-gray-400 py-4">
        Copyright ©2024 Mojoomla. All rights reserved.
      </footer>
    </main>
  );
}
