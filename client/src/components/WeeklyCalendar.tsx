import { useState, useMemo } from 'react';
import {
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addWeeks,
    subWeeks,
    isSameDay,
    addMinutes,
    startOfDay,
    setHours,
    setMinutes,
    isWithinInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our calendar events
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: 'blue' | 'green' | 'emerald' | 'amber' | 'red';
    type: 'availability' | 'booking' | 'blocked';
}

interface WeeklyCalendarProps {
    events?: CalendarEvent[];
    onSlotClick?: (date: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
    adminMode?: boolean;
}

const WeeklyCalendar = ({
    events = [],
    onSlotClick,
    onEventClick,
    adminMode = false
}: WeeklyCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calendar settings
    const startHour = 8; // 8 AM
    const endHour = 22; // 10 PM
    const timeSlotsPerHour = 1; // 1 slot per hour (can be 2 for 30min)

    // Generate days for the current week
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Generate time slots
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            for (let i = 0; i < timeSlotsPerHour; i++) {
                slots.push({
                    hour,
                    minute: (60 / timeSlotsPerHour) * i,
                    label: format(setMinutes(setHours(new Date(), hour), (60 / timeSlotsPerHour) * i), 'h a')
                });
            }
        }
        return slots;
    }, [startHour, endHour, timeSlotsPerHour]);

    // Navigation handlers
    const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    // Helper to get events for a specific day and time slot
    const getEventsForSlot = (day: Date, hour: number, minute: number) => {
        const slotStart = setMinutes(setHours(day, hour), minute);
        const slotEnd = addMinutes(slotStart, 60 / timeSlotsPerHour);

        return events.filter(event => {
            return (
                (event.start >= slotStart && event.start < slotEnd) ||
                (event.end > slotStart && event.end <= slotEnd) ||
                (event.start <= slotStart && event.end >= slotEnd)
            );
        });
    };

    // Helper to position events absolutely within the day column
    const getEventStyle = (event: CalendarEvent) => {
        const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
        const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();
        const dayStartMinutes = startHour * 60;

        const top = ((startMinutes - dayStartMinutes) / 60) * 64; // 64px is row height
        const height = ((endMinutes - startMinutes) / 60) * 64;

        return {
            top: `${top}px`,
            height: `${height}px`,
        };
    };

    const colorMap = {
        blue: 'bg-blue-500 hover:bg-blue-600 border-blue-600',
        green: 'bg-green-500 hover:bg-green-600 border-green-600',
        emerald: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600',
        amber: 'bg-amber-500 hover:bg-amber-600 border-amber-600',
        red: 'bg-red-500 hover:bg-red-600 border-red-600',
    };

    return (
        <div className="flex flex-col h-[800px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={prevWeek}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextWeek}>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Booked</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex flex-1 overflow-y-auto relative">
                {/* Time Labels Column */}
                <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50 sticky left-0 z-20">
                    <div className="h-12 border-b border-slate-200"></div> {/* Header spacer */}
                    {timeSlots.map((slot, i) => (
                        <div key={i} className="h-16 flex items-start justify-center pt-2 text-xs font-medium text-slate-500 border-b border-slate-100">
                            {slot.label}
                        </div>
                    ))}
                </div>

                {/* Days Columns */}
                <div className="flex flex-1 min-w-[800px]">
                    {weekDays.map((day, dayIndex) => {
                        const isToday = isSameDay(day, new Date());
                        const dayEvents = events.filter(e => isSameDay(e.start, day));

                        return (
                            <div key={dayIndex} className="flex-1 min-w-[100px] border-r border-slate-200 last:border-r-0 flex flex-col">
                                {/* Day Header */}
                                <div className={cn(
                                    "h-12 flex flex-col items-center justify-center border-b border-slate-200 sticky top-0 z-10 bg-white",
                                    isToday && "bg-blue-50"
                                )}>
                                    <span className={cn(
                                        "text-xs font-medium uppercase",
                                        isToday ? "text-blue-600" : "text-slate-500"
                                    )}>
                                        {format(day, 'EEE')}
                                    </span>
                                    <div className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold mt-0.5",
                                        isToday ? "bg-blue-600 text-white" : "text-slate-800"
                                    )}>
                                        {format(day, 'd')}
                                    </div>
                                </div>

                                {/* Time Slots Grid */}
                                <div className="relative flex-1">
                                    {/* Grid Lines */}
                                    {timeSlots.map((slot, i) => (
                                        <div
                                            key={i}
                                            className="h-16 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => onSlotClick?.(setMinutes(setHours(day, slot.hour), slot.minute))}
                                        >
                                        </div>
                                    ))}

                                    {/* Events Overlay */}
                                    {dayEvents.map((event) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={cn(
                                                "absolute left-1 right-1 rounded-md p-2 text-xs text-white shadow-sm border-l-4 cursor-pointer overflow-hidden z-10",
                                                colorMap[event.color || 'blue']
                                            )}
                                            style={getEventStyle(event)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEventClick?.(event);
                                            }}
                                        >
                                            <div className="font-bold truncate">{event.title}</div>
                                            <div className="opacity-90 truncate">
                                                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Current Time Indicator (if today) */}
                                    {isToday && (
                                        <div
                                            className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none"
                                            style={{
                                                top: `${((new Date().getHours() * 60 + new Date().getMinutes()) - (startHour * 60)) / 60 * 64}px`
                                            }}
                                        >
                                            <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WeeklyCalendar;
