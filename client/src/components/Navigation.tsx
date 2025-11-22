import { forwardRef, useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import profileImage from '../assets/profilhero.jpg';

const Navigation = forwardRef<HTMLElement>((props, ref) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clickedSection, setClickedSection] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    setClickedSection(sectionId);
    setIsMobileMenuOpen(false);
    setTimeout(() => setClickedSection(null), 600);

    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = document.querySelectorAll('[data-section]');
          const scrollPosition = window.scrollY + 100;

          sections.forEach((section) => {
            const sectionTop = (section as HTMLElement).offsetTop;
            const sectionHeight = (section as HTMLElement).offsetHeight;
            const sectionId = section.getAttribute('data-section');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              setActiveSection(sectionId || 'hero');
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Achievements', sectionId: 'portfolio' },
    { label: 'Pricing', sectionId: 'pricing' },
    { label: 'About', sectionId: 'about' },
    { label: 'Gallery', sectionId: 'gallery' },
    { label: 'FAQ', sectionId: 'faq' },
    { label: 'Contact', sectionId: 'contact' }
  ];

  return (
    <nav
      ref={ref}
      className="fixed top-0 left-0 right-0 z-[100] py-4 shadow-md"
      style={{ backgroundColor: '#ffffff' }} /* Force White */
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-3 group" onClick={() => scrollToSection('hero')}>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 group-hover:scale-110 border-[var(--brand-accent)]">
              <img
                src={profileImage}
                alt="Sakka Tennis Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-[var(--brand-dark)]">
              Sakka Tennis
            </span>
          </a>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="relative group py-2"
                >
                  <span className={`text-sm font-medium tracking-wide ${activeSection === item.sectionId
                    ? 'text-[var(--brand-accent)]'
                    : 'text-[var(--brand-dark)] hover:text-[var(--brand-accent)]'
                    }`}>
                    {item.label}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-current ${activeSection === item.sectionId ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-50'
                      }`}
                    style={{ color: 'var(--brand-accent)' }}
                  />
                </button>
              ))}
            </div >

            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 rounded"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`w-6 h-0.5 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''} `} style={{ backgroundColor: 'var(--brand-accent)' }}></span>
              <span className={`w-6 h-0.5 ${isMobileMenuOpen ? 'opacity-0' : ''} `} style={{ backgroundColor: 'var(--brand-accent)' }}></span>
              <span className={`w-6 h-0.5 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''} `} style={{ backgroundColor: 'var(--brand-accent)' }}></span>
            </button>
          </div >
        </div >

        <div className={`md:hidden overflow-hidden bg-white ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } `}>
          <div className="px-6 py-4 space-y-4 border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.sectionId}
                className="block w-full text-left nav-item hover:opacity-100 relative group py-2 text-[var(--brand-dark)] hover:text-[var(--brand-accent)]"
                onClick={() => scrollToSection(item.sectionId)}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-current ${activeSection === item.sectionId ? 'w-full opacity-60' : 'w-0 opacity-0'
                    } `}
                  style={{ color: 'var(--brand-accent)' }}
                ></span>
              </button>
            ))}
          </div>
        </div>
      </div >
    </nav >
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;

