import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const ProfessionalExperience = () => {
    const locations = [
        { period: "01/2025 - Present", organization: "Sani Sport, Montreal" },
        { period: "02/2024 - 06/2024", organization: "TENNIS13, Montreal" },
        { period: "10/2018 - 07/2023", organization: "Tennis Club de Monastir, Tunisia" }
    ];

    const expertiseList = [
        "Dynamic, personalized sessions tailored to each player's goals",
        "Development of technical, tactical, and mental skills (including match stress management)",
        "Match analysis and performance improvement in competitive settings",
        "Strong communication skills and ability to motivate kids, adults, and competitive players",
        "Modern coaching approach focused on fast progression and enjoyment of the game",
        "Competitive mindset with a strong focus on results",
        "Coach of players who have won Tunisian national championships (Lina Soussi, Rined Saafi, Lina Youssef, Anas Ben Cheikh)",
        "Experience working with all age groups and skill levels (beginner to advanced)",
        "Sparring partner with players in international ITF tournaments (M15, M25)",
        "Participation in the organization of the Jasmin Open WTA 250 tournament"
    ];

    return (
        <section className="py-20 px-6 bg-[var(--background)]">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-4xl md:text-5xl font-medium mb-12 text-white text-center md:text-left">Professional Experience</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Column: Title & Locations */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="glass-panel-dark p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--brand-accent)] rounded-full blur-[80px] opacity-20 -mr-10 -mt-10"></div>
                                <h4 className="text-3xl md:text-4xl font-bold text-white mb-2">Tennis Coach</h4>
                                <p className="text-[var(--brand-accent)] font-medium text-lg md:text-xl mb-10 tracking-wide">Career Timeline</p>
                                
                                <div className="space-y-8 relative before:absolute before:inset-0 before:left-[7px] md:before:left-[9px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--brand-accent)] before:via-[var(--brand-accent)]/30 before:to-transparent">
                                    {locations.map((loc, index) => (
                                        <div key={index} className="relative flex items-start pl-8 md:pl-10 group">
                                            <div className="absolute left-0 top-1.5 flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full border-[3px] border-[var(--brand-accent)] bg-slate-900 shadow-[0_0_15px_rgba(209,241,50,0.5)] z-10 transition-transform duration-300 group-hover:scale-125"></div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white leading-snug text-lg md:text-xl">{loc.organization}</span>
                                                <span className="text-sm md:text-base text-emerald-400 mt-1.5 font-medium">{loc.period}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Expertise & Achievements */}
                        <div className="lg:col-span-7">
                            <div className="glass-panel-dark p-8 md:p-10 rounded-3xl border border-white/5 h-full relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500 rounded-full blur-[80px] opacity-10 -ml-10 -mb-10"></div>
                                <h4 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center">
                                    <span style={{ color: 'var(--brand-accent)' }} className="mr-4 text-3xl">⚡</span>
                                    Coaching Expertise
                                </h4>
                                
                                <ul className="space-y-5 relative z-10">
                                    {expertiseList.map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 mt-0.5 mr-4 shrink-0 text-[var(--brand-accent)]" />
                                            <span className="text-white/80 leading-relaxed text-base md:text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ProfessionalExperience;
