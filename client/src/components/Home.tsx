import { Helmet } from 'react-helmet-async';
import Hero from './Hero';
import Portfolio from './Portfolio';
import ProfessionalExperience from './ProfessionalExperience';
import Testimonials from './Testimonials';
import About from './About';
import Gallery from './Gallery';
import Pricing from './Pricing';
import ReservationsTeaser from './ReservationsTeaser';
import FAQ from './FAQ';
import Contact from './Contact';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Sakka Tennis | Professional Tennis Coaching in Montreal</title>
                <meta name="description" content="Elevate your tennis game with Mohamed Anis Sakka. Providing private lessons, group sessions, and competitive training in Montreal." />
                <link rel="canonical" href="https://www.tennissakkamtl.com/" />
            </Helmet>
            <div data-section="hero" className="section-hero">
                <Hero />
            </div>
            <div data-section="about" className="section-dark">
                <About />
            </div>
            <div data-section="experience" className="section-dark">
                <ProfessionalExperience />
            </div>
            <div data-section="portfolio" className="section-dark">
                <Portfolio />
            </div>
            <div data-section="testimonials" className="section-dark">
                <Testimonials />
            </div>
            <div data-section="gallery" className="section-dark">
                <Gallery />
            </div>
            <div data-section="pricing" className="section-light">
                <Pricing />
            </div>
            <div data-section="reservations" className="section-light">
                <ReservationsTeaser />
            </div>
            <div data-section="faq" className="section-light">
                <FAQ />
            </div>
            <div data-section="contact" className="section-light">
                <Contact />
            </div>
        </>
    );
};

export default Home;
