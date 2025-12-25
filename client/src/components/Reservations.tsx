import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Reservations = () => {
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
        <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto min-h-[80vh] flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--brand-dark)]">
                    Book Your <span className="text-[var(--brand-accent)]">Session</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Select a time slot below to confirm your reservation immediately.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-grow w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 h-[800px]"
            >
                <iframe
                    src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ02fhfxnqZFQMNmgggJktmKHHMfr6cuqcMG2FhefaDwoDfexjbDnxmmr6kvjxElXZC7crFZRlUf?gv=true"
                    style={{ border: 0 }}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Google Appointment Scheduling"
                ></iframe>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 text-center"
            >
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px bg-slate-200 w-24"></div>
                    <span className="text-slate-400 font-medium uppercase tracking-wider text-sm">Or book via message</span>
                    <div className="h-px bg-slate-200 w-24"></div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Prefer to chat?</h3>
                    <p className="text-slate-600 mb-6">
                        You can also send me a message directly to discuss availability and book a slot.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </motion.div>
        </section>
    );
};

export default Reservations;
