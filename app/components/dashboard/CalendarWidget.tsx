'use client';

import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarWidget() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [direction, setDirection] = useState(0);

    const handlePrevMonth = () => {
        setDirection(-1);
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
        setDirection(1);
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleToday = () => {
        setDirection(currentMonth > new Date() ? -1 : 1);
        setCurrentMonth(new Date());
    };

    // Calendar logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 50 : -50,
                opacity: 0
            };
        },
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => {
            return {
                x: direction < 0 ? 50 : -50,
                opacity: 0
            };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card-light rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-lg font-medium text-gray-900">Calendario</h2>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                        <span className="text-gray-600">Avisos</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span className="text-gray-600">Eventos</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-gray-600">Reservas</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                        <span className="material-icons-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                        onClick={handleToday}
                        className="px-3 py-1 rounded border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Hoy
                    </button>
                    <button onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                        <span className="material-icons-outlined text-sm">chevron_right</span>
                    </button>
                </div>

                <h3 className="font-semibold text-gray-700 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h3>

                <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button className="px-3 py-1 bg-white text-xs font-medium rounded shadow-sm text-gray-800">Mes</button>
                    <button className="px-3 py-1 text-gray-500 text-xs font-medium rounded hover:bg-white hover:text-gray-800 transition-all">Sem</button>
                    <button className="px-3 py-1 text-gray-500 text-xs font-medium rounded hover:bg-white hover:text-gray-800 transition-all">Día</button>
                    <button className="px-3 py-1 text-gray-500 text-xs font-medium rounded hover:bg-white hover:text-gray-800 transition-all">Lista</button>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 text-center text-xs font-semibold text-gray-500 py-2">
                    <div>DOM</div>
                    <div>LUN</div>
                    <div>MAR</div>
                    <div>MIE</div>
                    <div>JUE</div>
                    <div>VIE</div>
                    <div>SAB</div>
                </div>

                <div className="relative h-64 overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                        <motion.div
                            key={currentMonth.toISOString()}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="grid grid-cols-7 h-full absolute inset-0"
                        >
                            {days.map((day, index) => {
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isDayToday = isToday(day);

                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={`
                                            border-b border-gray-100 p-1 min-h-[50px]
                                            ${index % 7 !== 6 ? 'border-r' : ''}
                                            ${!isCurrentMonth ? 'bg-gray-50/30' : ''}
                                            hover:bg-gray-50 transition-colors cursor-pointer
                                        `}
                                    >
                                        <div className="flex justify-end">
                                            <span
                                                className={`
                                                    text-[10px] w-6 h-6 flex items-center justify-center rounded-full
                                                    ${isDayToday ? 'bg-blue-600 text-white font-bold' : ''}
                                                    ${!isDayToday && isCurrentMonth ? 'text-gray-700' : ''}
                                                    ${!isDayToday && !isCurrentMonth ? 'text-gray-400' : ''}
                                                `}
                                            >
                                                {format(day, 'd')}
                                            </span>
                                        </div>

                                        {/* Example event dot based on random logic for demo */}
                                        {isCurrentMonth && parseInt(format(day, 'd')) % 5 === 0 && (
                                            <div className="mt-1 flex justify-end gap-1 px-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
