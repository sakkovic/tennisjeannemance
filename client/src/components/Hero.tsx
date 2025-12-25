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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)] pt-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="relative z-10 text-left">
          <h1
            className="text-6xl md:text-8xl font-medium mb-4 leading-tight"
            style={{ fontWeight: 500, color: 'var(--brand-accent)' }}
          >
            Tennis
          </h1>
          <h2
            className="text-4xl md:text-6xl font-medium mb-8 leading-tight"
            style={{ fontWeight: 500, color: 'var(--brand-dark)' }}
          >
            Coaching
            <span className="block text-2xl md:text-3xl mt-2 opacity-80">
              transforming players into champions.
            </span>
          </h2>
          <p
            className="text-lg md:text-xl mb-12 max-w-xl leading-relaxed text-gray-600"
          >
            I have <span className="font-semibold" style={{ color: 'var(--brand-accent)' }}>20+ years of playing experience</span> and <span className="font-semibold" style={{ color: 'var(--brand-accent)' }}>5+ years of coaching</span>. I specialize in developing young players and helping athletes of all levels reach their full potential on the court.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
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
          </div>
        </div>

        {/* Image Content */}
        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={heroBg}
            alt="Tennis Court"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
