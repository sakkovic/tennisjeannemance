import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Introduction from './components/Introduction';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Gallery from './components/Gallery';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import useDynamicTheme from './hooks/use-dynamic-theme';

function App() {
  const { navRef, mainRef } = useDynamicTheme();

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div ref={mainRef} className="min-h-screen overflow-x-hidden">
            <Navigation ref={navRef} />
            <div data-section="hero" className="section-hero">
              <Hero />
            </div>
            <div data-section="introduction" className="section-dark">
              <Introduction />
            </div>
            <div data-section="portfolio" className="section-dark">
              <Portfolio />
            </div>
            <div data-section="testimonials" className="section-dark">
              <Testimonials />
            </div>
            <div data-section="about" className="section-dark">
              <About />
            </div>
            <div data-section="gallery" className="section-dark">
              <Gallery />
            </div>
            <div data-section="pricing" className="section-light">
              <Pricing />
            </div>
            <div data-section="faq" className="section-light">
              <FAQ />
            </div>
            <div data-section="contact" className="section-light">
              <Contact />
            </div>
            <Footer />
            <BackToTop />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

