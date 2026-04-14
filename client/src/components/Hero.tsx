import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import heroBg from '../assets/front _landing_page_image.jpeg';

const Hero = () => {
  const [_, setLocation] = useLocation();
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-start overflow-hidden bg-[var(--background)] pt-6">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="relative z-10 text-left">
          <h1 className="flex flex-col text-left m-0 p-0">
            <motion.span
              className="text-6xl md:text-8xl font-medium mb-4 leading-tight block"
              style={{ fontWeight: 500, color: 'var(--brand-accent)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              Tennis
            </motion.span>
            <motion.span
              className="text-4xl md:text-6xl font-medium mb-8 leading-tight block"
              style={{ fontWeight: 500, color: 'var(--brand-dark)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            >
              Coaching
              <span className="block text-2xl md:text-3xl mt-2 opacity-80 font-normal">
                in Montreal.
              </span>
            </motion.span>
          </h1>
          <motion.p
            className="text-lg md:text-xl mb-12 max-w-xl leading-relaxed text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            I have <span className="font-semibold" style={{ color: 'var(--brand-accent)' }}>20+ years of playing experience</span> and <span className="font-semibold" style={{ color: 'var(--brand-accent)' }}>9+ years of coaching</span>. I specialize in developing young players and helping athletes of all levels reach their full potential on the court.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          >
            <button
              onClick={scrollToContact}
              className="px-8 py-4 bg-[var(--brand-accent)] text-white rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Discover My Services
            </button>
            <button
              className="text-lg underline underline-offset-4 transition-colors duration-200 flex items-center gap-2 text-[var(--brand-dark)] hover:text-[var(--brand-accent)]"
              onClick={() => setLocation('/reservations')}
            >
              or book a lesson
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Image Content */}
        <motion.div
          className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          <img
            src={heroBg}
            alt="Professional tennis coaching session in Montreal by Mohamed Anis Sakka"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
