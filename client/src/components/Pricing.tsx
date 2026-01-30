import React from 'react';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

const Pricing = () => {
    const [_, setLocation] = useLocation();
    const plans = [
        {
            name: "Private Session",
            price: "70",
            period: "/ hour",
            description: "One-on-one coaching tailored to your specific needs and goals.",
            features: [
                "Personalized technical analysis",
                "Tactical game improvement",
                "Video analysis included",
                "Equipment advice",
                "Flexible scheduling"
            ],
            popular: false,
            color: "blue"
        },
        {
            name: "Performance Pack",
            price: "300",
            period: "/ 5 sessions",
            description: "Intensive program for players committed to rapid improvement.",
            features: [
                "All Private Session benefits",
                "Progress tracking report",
                "Match play analysis",
                "Fitness & conditioning tips",
                "Priority booking"
            ],
            popular: true,
            color: "emerald"
        },
        {
            name: "Group Clinic",
            price: "50",
            period: "/ person",
            description: "Fun and competitive group sessions to improve with others.",
            features: [
                "Small groups (max 4 players)",
                "Drills and match situations",
                "Tactical positioning",
                "Social atmosphere",
                "Weekly sessions"
            ],
            popular: false,
            color: "amber"
        }
    ];

    return (
        <section id="pricing" className="py-16 bg-slate-50 relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-slate-900">Coaching Packages</h2>
                    <div className="w-20 h-1 bg-emerald-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Choose the plan that fits your goals. Whether you're a beginner or a competitive player, I have a program for you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${plan.popular ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-slate-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
                                    <Star size={12} fill="currentColor" /> Most Popular
                                </div>
                            )}

                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                <p className="text-slate-500 text-sm mb-6 h-10">{plan.description}</p>

                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                                    <span className="text-slate-500 ml-2">{plan.period}</span>
                                </div>

                                <button
                                    onClick={() => setLocation('/reservations')}
                                    className={`w-full py-3 rounded-lg font-semibold transition-colors mb-8 ${plan.popular
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                        }`}>
                                    Book Now
                                </button>

                                <div className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start">
                                            <div className={`mt-1 mr-3 p-1 rounded-full ${plan.popular ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-600 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
