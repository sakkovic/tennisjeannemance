import { motion } from 'framer-motion';

const ProfessionalExperience = () => {
    const experiences = [
        {
            period: "01/2025 - Present",
            title: "Tennis Coach",
            organization: "Sani Sport, Montreal",
            description: "Organizing and leading sessions for players of all levels (Recreational and Competitive)"
        },
        {
            period: "02/2024 - 06/2024",
            title: "Tennis Coach",
            organization: "TENNIS13, Montreal",
            description: "Coaching players of all levels in a professional environment"
        },
        {
            period: "10/2018 - 07/2023",
            title: "Tennis Coach",
            organization: "Tennis Club de Monastir, Tunisia",
            description: "Sparring Partner at Future M15 and M25 Tournaments. Team Captain — Semi-Finalist of the Tunisian U12 Championship in 2023"
        }
    ];

    return (
        <section className="py-12 px-6 bg-[var(--background)]">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-3xl font-medium mb-8 text-white">Professional Experience</h3>
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

export default ProfessionalExperience;
