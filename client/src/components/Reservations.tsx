import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

const Reservations = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleBooking = (method: 'sms' | 'whatsapp') => {
        const formattedDate = format(selectedDate, 'MMMM do, yyyy');
        // Default to "Morning/Afternoon" or just generic since we don't have a specific slot from the iframe
        const message = `Hi, I checked your calendar and would like to book a tennis session on ${formattedDate}. Is this available?`;
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "1234567890"; // Replace with actual number

        if (method === 'sms') {
            window.open(`sms:${phoneNumber}?body=${encodedMessage}`, '_blank');
        } else {
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        }

        setIsDialogOpen(false);
        toast.success("Booking request initiated! Check your messaging app.");
    };

    return (
        <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--brand-dark)]">
                    Weekly <span className="text-[var(--brand-accent)]">Schedule</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Check my availability below.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center space-y-10"
            >
                {/* Premium Calendar Container */}
                <div className="w-full max-w-5xl relative group">
                    {/* Decorative background blur */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                    <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                        {/* Window Header */}
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            </div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                Live Availability
                            </div>
                        </div>

                        {/* Calendar Iframe */}
                        <iframe
                            src="https://calendar.google.com/calendar/embed?src=2244e4b291c1f8ad3481d0bf163b0927bfaca012cba5da69ae337a5b29df551d%40group.calendar.google.com&ctz=America%2FMontreal&mode=WEEK&showTitle=0&showPrint=0&showCalendars=0&wkst=2&bgcolor=%23ffffff&color=%23059669"
                            style={{ border: 0 }}
                            width="100%"
                            height="700"
                            frameBorder="0"
                            scrolling="no"
                            title="Tennis Coach Availability"
                            className="w-full"
                        ></iframe>
                    </div>
                </div>

                {/* Booking Action Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-2xl w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to play?</h3>
                    <p className="text-slate-600 mb-8">
                        Find a green slot above that works for you, then click below to send me a booking request directly via message.
                    </p>

                    <Button
                        size="lg"
                        className="bg-[var(--brand-accent)] hover:bg-[var(--brand-primary)] text-white gap-2 px-8 h-12 text-lg shadow-emerald-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        onClick={() => {
                            setSelectedDate(new Date());
                            setIsDialogOpen(true);
                        }}
                    >
                        <MessageCircle className="w-5 h-5" />
                        Request Booking
                    </Button>
                </div>
            </motion.div>

            {/* Booking Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold text-center">Request Booking</DialogTitle>
                        <DialogDescription className="text-center">
                            Send a message to request a session.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-2">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Selected Date</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {format(selectedDate, 'MMMM do, yyyy')}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">(Time will be discussed in chat)</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-slate-700 text-center">
                                Choose your preferred messaging app:
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                <Button
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none h-12 text-base shadow-sm"
                                    onClick={() => handleBooking('whatsapp')}
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Continue with WhatsApp
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-slate-200 hover:bg-slate-50 h-12 text-base text-slate-700"
                                    onClick={() => handleBooking('sms')}
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Send SMS
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Empty footer since buttons are in the main body now */}
                    <DialogFooter className="hidden" />
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default Reservations;
