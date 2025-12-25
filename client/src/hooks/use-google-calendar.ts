
import { useState, useEffect } from 'react';
import { addHours, startOfToday, addDays, setHours } from 'date-fns';
import { CalendarEvent } from '@/components/WeeklyCalendar';

// Mock data generator
const generateMockEvents = (): CalendarEvent[] => {
    const today = startOfToday();

    return [
        {
            id: '1',
            title: 'Private Coaching',
            start: setHours(addDays(today, 1), 10), // Tomorrow 10 AM
            end: setHours(addDays(today, 1), 11),
            color: 'blue',
            type: 'booking'
        },
        {
            id: '2',
            title: 'Available Slot',
            start: setHours(addDays(today, 2), 14), // Day after tomorrow 2 PM
            end: setHours(addDays(today, 2), 16),
            color: 'emerald',
            type: 'availability'
        },
        {
            id: '3',
            title: 'Group Clinic',
            start: setHours(addDays(today, 3), 18),
            end: setHours(addDays(today, 3), 20),
            color: 'amber',
            type: 'booking'
        },
        {
            id: '4',
            title: 'Available Slot',
            start: setHours(addDays(today, 4), 9),
            end: setHours(addDays(today, 4), 12),
            color: 'emerald',
            type: 'availability'
        }
    ];
};

export const useGoogleCalendar = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch events from our backend API
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/calendar/events');

                if (!response.ok) {
                    throw new Error('Failed to fetch calendar events');
                }

                const data = await response.json();

                // Convert string dates back to Date objects
                const parsedEvents = data.map((event: any) => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));

                setEvents(parsedEvents);
            } catch (err) {
                setError('Failed to load calendar events');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { events, loading, error };
};
