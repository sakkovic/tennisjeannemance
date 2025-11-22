import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroBg from '../assets/front _landing_page_image.jpeg';

const Hero = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Tennis Court"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay for text readability */}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-medium mb-4 leading-tight"
          style={{ fontWeight: 500, color: 'var(--brand-accent)' }}
        >
          Bonjour, I'm Sakka,
        </h1>
        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-medium mb-8 leading-tight max-w-5xl"
          style={{ fontWeight: 500, color: 'var(--brand-dark)' }}
        >
          Professional Tennis Coach<br />
          transforming players into champions.
        </h2>
        <p
          className="text-lg md:text-xl mb-12 max-w-4xl leading-relaxed"
          style={{ fontWeight: 400, color: 'var(--brand-dark)' }}
        >
          I have <span className="font-semibold" style={{ color: 'var(--brand-accent)' }}>20+ years of playing experience</span> and <span className="font-semibold" style={{ color: 'var(--brand-accent)' }}>5+ years of coaching</span>. I specialize in developing young players and helping athletes of all levels reach their full potential on the court.
        </p>
        <div
          className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
        >
          <button
            className="px-8 py-4 text-lg rounded-full transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: 'var(--brand-dark)', color: 'var(--brand-light)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--brand-accent)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--brand-dark)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onClick={() => {
              const pricingSection = document.querySelector('[data-section="pricing"]');
              if (pricingSection) {
                pricingSection.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }}
          >
            Discover My Services
          </button>
          <button
            className="text-lg underline underline-offset-4 transition-colors duration-200 flex items-center gap-2 text-white hover:text-brand-accent"
            onClick={scrollToContact}
          >
            or book a lesson
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

