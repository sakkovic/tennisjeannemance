import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
    const faqs = [
        {
            question: "What skill levels do you coach?",
            answer: "I coach players of all levels, from absolute beginners to advanced competitive players. My teaching methodology adapts to your specific needs and experience level."
        },
        {
            question: "Do I need to bring my own equipment?",
            answer: "It's best if you have your own racket, but I can provide one for your first few sessions if needed. I always provide balls and training aids. Please wear proper tennis shoes and comfortable athletic clothing."
        },
        {
            question: "Where do the lessons take place?",
            answer: "I primarily teach at Sani Sport. However, I am also available to travel to private courts or other clubs in the Montreal area upon request (additional travel fees may apply)."
        },
        {
            question: "What is your cancellation policy?",
            answer: "I require a 24-hour notice for cancellations. Cancellations made less than 24 hours in advance will be charged the full session fee, as the court time and my schedule are reserved for you."
        },
        {
            question: "Do you offer video analysis?",
            answer: "Yes! Video analysis is a powerful tool for improvement. I use high-speed video to analyze your strokes and movement, providing visual feedback that helps correct technique faster."
        }
    ];

    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5"
                    >
                        <h2 className="text-4xl font-bold mb-6 text-slate-900">Frequently Asked Questions</h2>
                        <div className="w-20 h-1 bg-emerald-600 rounded-full mb-8"></div>
                        <p className="text-lg text-slate-600 mb-8">
                            Find answers to common questions about my coaching services, scheduling, and what to expect during our sessions.
                        </p>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="font-bold text-lg mb-2 text-slate-800">Still have questions?</h3>
                            <p className="text-slate-600 mb-4">Can't find the answer you're looking for? Feel free to contact me directly.</p>
                            <a href="#contact" className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2">
                                Contact Me <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-7">
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="border border-slate-200 rounded-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className={`w-full flex items-center justify-between p-6 text-left transition-colors ${activeIndex === index ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className={`font-semibold text-lg ${activeIndex === index ? 'text-emerald-700' : 'text-slate-800'}`}>
                                            {faq.question}
                                        </span>
                                        <span className={`p-2 rounded-full transition-colors ${activeIndex === index ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {activeIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-slate-50 border-t border-slate-100">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
