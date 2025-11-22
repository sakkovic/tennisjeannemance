import { motion } from 'framer-motion';
import profileImage from '../assets/_A100156.jpg';
import { Award, Globe, Users, Trophy } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: Trophy,
      title: "Vice-Champion de Tunisie",
      description: "2018 Junior & 2019 Senior"
    },
    {
      icon: Award,
      title: "Meilleur Classement",
      description: "Handicap 0 (classement européen)"
    },
    {
      icon: Users,
      title: "Champions Formés",
      description: "Lina Soussi, Rined Saafi, Lina Youssef, Anas ben Cheikh, Lamiss Houas"
    },
    {
      icon: Globe,
      title: "Expérience Internationale",
      description: "Jasmin OPEN WTA 250 Monastir, Rogers Cup Montréal"
    }
  ];

  const experiences = [
    {
      period: "01/2025 - Présent",
      title: "Entraîneur de Tennis",
      organization: "Sani Sport, Montréal",
      description: "Organisation et animation des cours pour joueurs de niveaux variés (Récréative et Compétitive)"
    },
    {
      period: "02/2024 - 06/2024",
      title: "Entraîneur de Tennis",
      organization: "TENNIS13, Montréal",
      description: "Coaching de joueurs de tous niveaux dans un environnement professionnel"
    },
    {
      period: "10/2018 - 07/2023",
      title: "Entraîneur de Tennis",
      organization: "Tennis Club de Monastir, Tunisie",
      description: "Sparring Partner aux Tournois Future M15 et M25. Capitaine de l'équipe - Demi-Finaliste du Championnat tunisien U12 en 2023"
    }
  ];

  return (
    <section className="pt-32 pb-16 px-6">
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
                <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: 'var(--brand-accent)', color: 'white' }}>
                  🇫🇷 Français
                </span>
                <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: 'var(--brand-accent)', color: 'white' }}>
                  🇬🇧 English
                </span>
                <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: 'var(--brand-accent)', color: 'white' }}>
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

        {/* Highlights Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-medium mb-8">Highlights</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="p-6 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <highlight.icon className="w-8 h-8 mb-4" style={{ color: 'var(--brand-accent)' }} />
                <h4 className="font-semibold mb-2 text-white">{highlight.title}</h4>
                <p className="text-sm text-white/70">{highlight.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-medium mb-8">Professional Experience</h3>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="p-6 rounded-xl transition-all duration-300 hover:translate-x-2"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderLeft: '4px solid var(--brand-accent)' }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-semibold text-white">{exp.title}</h4>
                  <span className="text-sm text-white/60">{exp.period}</span>
                </div>
                <p className="font-medium mb-2" style={{ color: 'var(--brand-accent)' }}>{exp.organization}</p>
                <p className="text-white/80">{exp.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
