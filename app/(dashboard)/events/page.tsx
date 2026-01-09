import { getUpcomingEvents } from '../../lib/actions';
import EventList from '../../components/events/EventList';

export default async function EventsPage() {
    const { data } = await getUpcomingEvents();

    const formattedEvents = data?.events.map(event => ({
        ...event,
        date: event.date.toISOString(),
        startTime: event.startTime.toISOString(),
        endTime: event.endTime ? event.endTime.toISOString() : null,
    })) || [];

    const formattedReservations = data?.reservations.map(res => ({
        ...res,
        date: res.date.toISOString(),
        startTime: res.startTime.toISOString(),
        endTime: res.endTime.toISOString(),
    })) || [];

    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agenda de Actividades</h1>
                    <p className="text-gray-500 text-sm mt-1">Próximos eventos comunitarios y tus reservas personales.</p>
                </div>

                <EventList
                    events={formattedEvents}
                    reservations={formattedReservations}
                    isStaff={data?.isStaff}
                />
            </div>
        </main>
    );
}
