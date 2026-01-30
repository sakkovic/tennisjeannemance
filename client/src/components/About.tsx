import { motion } from 'framer-motion';
import profileImage from '../assets/_A100156.jpg';

const About = () => {
  return (
    <section className="pt-12 md:pt-8 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-normal mb-6">About Me</h2>
            <div className="text-lg space-y-4">
              <p>
                I'm Mohamed Anis Sakka, a passionate professional tennis coach with <strong style={{ color: 'var(--brand-accent)' }}>20+ years of playing experience</strong> and <strong style={{ color: 'var(--brand-accent)' }}>5+ years of coaching expertise</strong>. Based in Montreal, I'm dedicated to helping players of all levels achieve their tennis goals.
              </p>
              <p>
                My coaching philosophy combines <strong style={{ color: 'var(--brand-accent)' }}>technical excellence, tactical awareness, and mental resilience</strong>. I've successfully trained multiple Tunisian national champions and have extensive experience working with young players in competitive development programs.
              </p>
              <p>
                I specialize in developing young talent, improving technique and form, and preparing players for competitive tournaments. My approach is personalized and adaptive, tailored to each player's unique strengths, weaknesses, and aspirations.
              </p>
              <p>
                Certified in youth coaching (2018) and trained in advanced coaching techniques (FRAPPE 2024), I bring both international experience and local expertise to help you excel on the court.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--brand-accent)', color: 'white' }}>
                  🇫🇷 Français
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--brand-accent)', color: 'white' }}>
                  🇬🇧 English
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--brand-accent)', color: 'white' }}>
                  🇹🇳 العربية
                </span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src={profileImage}
              alt="Mohamed Anis Sakka - Professional Tennis Coach"
              className="rounded-2xl shadow-2xl max-w-sm w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
