import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useLocation } from 'wouter';

const MobileBookButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [_, setLocation] = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling past the hero section (approx 500px)
            const shouldShow = window.scrollY > 500;
            setIsVisible(shouldShow);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 md:hidden w-auto"
                    initial={{ y: 100, opacity: 0, x: "-50%" }}
                    animate={{ y: 0, opacity: 1, x: "-50%" }}
                    exit={{ y: 100, opacity: 0, x: "-50%" }}
                    transition={{ duration: 0.3 }}
                >
                    <button
                        onClick={() => setLocation('/reservations')}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm hover:bg-emerald-700 transition-colors whitespace-nowrap"
                    >
                        <Calendar size={18} />
                        Book a Session
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileBookButton;
