'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { getCalendarData } from '../../lib/actions';
import BookingModal from './BookingModal';

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [direction, setDirection] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Data state
    const [calendarData, setCalendarData] = useState<{ reservations: any[], events: any[], notices: any[] }>({ reservations: [], events: [], notices: [] });

    // Fetch data when month changes
    useEffect(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        getCalendarData(month, year).then(res => {
            if (res.success) {
                setCalendarData(res.data);
            }
        });
    }, [currentDate]);

    const changeMonth = (increment: number) => {
        setDirection(increment);
        setCurrentDate(prev => increment > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
    };

    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
        setIsModalOpen(true);
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Fill start empty days
    const startDay = monthStart.getDay(); // 0 is Sunday
    const blanks = Array(startDay === 0 ? 6 : startDay - 1).fill(null); // Adjust for Monday start if needed. Default 0=Sun. 

    // Helper to find items for a day
    const getItemsForDay = (day: Date) => {
        const dayReservations = calendarData.reservations.filter(r => isSameDay(new Date(r.date), day));
        const dayEvents = calendarData.events.filter(e => isSameDay(new Date(e.date), day));
        return { dayReservations, dayEvents };
    };

    const dayVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.01 }
        })
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-800 text-lg capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h2>
                <div className="flex gap-1">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <span className="material-icons-outlined text-xl">chevron_left</span>
                    </button>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <span className="material-icons-outlined text-xl">chevron_right</span>
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="ml-2 px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                        Hoy
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-xs text-gray-400 font-medium py-1">
                        {day}
                    </div>
                ))}
            </div>

            <AnimatePresence mode='wait' custom={direction}>
                <motion.div
                    key={currentDate.toISOString()}
                    initial={{ x: direction * 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction * -50, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-7 gap-1 flex-1 content-start"
                >
                    {blanks.map((_, i) => <div key={`blank-${i}`} className="h-10 sm:h-auto aspect-square"></div>)}

                    {days.map((day, i) => {
                        const { dayReservations, dayEvents } = getItemsForDay(day);
                        const hasItems = dayReservations.length > 0 || dayEvents.length > 0;

                        return (
                            <motion.button
                                custom={i}
                                variants={dayVariants}
                                initial="hidden"
                                animate="visible"
                                key={day.toISOString()}
                                onClick={() => handleDayClick(day)}
                                className={`
                                    relative h-10 sm:h-auto aspect-square rounded-xl flex items-center justify-center text-sm transition-all
                                    ${isSameDay(day, new Date()) ? 'bg-primary text-white shadow-md font-bold' : 'hover:bg-gray-50 text-gray-700'}
                                    ${hasItems && !isSameDay(day, new Date()) ? 'bg-gray-50' : ''}
                                `}
                            >
                                {format(day, 'd')}

                                {/* Indicators */}
                                <div className="absolute bottom-1 right-1/2 translate-x-1/2 flex gap-0.5">
                                    {dayReservations.length > 0 && (
                                        <div className={`w-1 h-1 rounded-full ${isSameDay(day, new Date()) ? 'bg-white' : 'bg-blue-400'}`}></div>
                                    )}
                                    {dayEvents.length > 0 && (
                                        <div className={`w-1 h-1 rounded-full ${isSameDay(day, new Date()) ? 'bg-white' : 'bg-orange-400'}`}></div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {/* Legend */}
            <div className="mt-4 flex gap-4 justify-center text-[10px] text-gray-400">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>Reserva</div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>Evento</div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
            />
        </div>
    );
}
