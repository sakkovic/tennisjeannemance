import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';

const Footer = () => {
  const [_, setLocation] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      setLocation('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Sakka Tennis</h3>
            <p className="text-slate-400 leading-relaxed">
              Professional tennis coaching in Montreal. Helping players of all levels achieve their full potential through personalized training and technical excellence.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-emerald-600 transition-colors text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-emerald-600 transition-colors text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-emerald-600 transition-colors text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection('about')} className="text-slate-400 hover:text-emerald-500 transition-colors">About Me</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('portfolio')} className="text-slate-400 hover:text-emerald-500 transition-colors">Achievements</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('pricing')} className="text-slate-400 hover:text-emerald-500 transition-colors">Coaching Packages</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('faq')} className="text-slate-400 hover:text-emerald-500 transition-colors">FAQ</button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-emerald-500 shrink-0 mt-1" />
                <span className="text-slate-400">Montreal, Quebec<br />Available at Sani Sport & Public Courts</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-emerald-500 shrink-0" />
                <a href="tel:+15148120621" className="text-slate-400 hover:text-white transition-colors">+1 (514) 812-0621</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-emerald-500 shrink-0" />
                <a href="mailto:anis.federe@gmail.com" className="text-slate-400 hover:text-white transition-colors">anis.federe@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* CTA Column */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Ready to Play?</h4>
            <p className="text-slate-400 mb-6">
              Book your session today and take your game to the next level.
            </p>
            <button
              onClick={() => setLocation('/reservations')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Book a Lesson
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Mohamed Anis Sakka. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
