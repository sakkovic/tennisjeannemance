import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

const ReservationsTeaser = () => {
    const [_, setLocation] = useLocation();

    const handleBooking = (method: 'sms' | 'whatsapp') => {
        const message = "Hi, I'd like to book a tennis session. What are your available times?";
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "5148120621";

        if (method === 'sms') {
            window.open(`sms:${phoneNumber}?body=${encodedMessage}`, '_blank');
        } else {
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        }
        toast.success("Opening messaging app...");
    };

    return (
        <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto" id="reservations-teaser">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--brand-dark)]">
                    Book Your <span className="text-[var(--brand-accent)]">Session</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Ready to improve your game? Click the button below to view available slots and book your lesson instantly.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center space-y-10"
            >
                {/* Booking Action Card */}
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-3xl w-full text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-slate-800 mb-4">Online Reservations</h3>
                        <p className="text-slate-600 mb-8 text-lg">
                            Access my real-time calendar to find a time that works for you. No back-and-forth messaging required.
                        </p>

                        <Button
                            size="lg"
                            className="bg-[var(--brand-accent)] hover:bg-[var(--brand-primary)] text-white gap-3 px-10 h-16 text-xl shadow-emerald-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 rounded-full mb-8"
                            onClick={() => setLocation('/reservations')}
                        >
                            <CalendarIcon className="w-6 h-6" />
                            Book a Slot Online
                        </Button>

                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="h-px bg-slate-200 w-16"></div>
                            <span className="text-slate-400 font-medium uppercase tracking-wider text-xs">Or message me</span>
                            <div className="h-px bg-slate-200 w-16"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                            <Button
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none h-12 text-base shadow-sm"
                                onClick={() => handleBooking('whatsapp')}
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                WhatsApp
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
            </motion.div>
        </section>
    );
};

export default ReservationsTeaser;
