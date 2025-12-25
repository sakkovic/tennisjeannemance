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
        },
        {
            question: "What payment methods do you accept?",
            answer: "I accept both cash and Interac e-transfers. However, cash payments are preferred."
        }
    ];

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl font-bold mb-6 text-slate-900">Frequently Asked Questions</h2>
                    <div className="w-20 h-1 bg-emerald-600 rounded-full mb-8 mx-auto"></div>
                    <p className="text-lg text-slate-600">
                        Find answers to common questions about my coaching services, scheduling, and what to expect during our sessions.
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-6">
                            {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="border border-slate-200 rounded-xl overflow-hidden h-fit bg-white hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className={`w-full flex items-center justify-between p-6 text-left transition-colors ${activeIndex === index ? 'bg-slate-50' : 'bg-white'
                                            }`}
                                    >
                                        <span className={`font-semibold text-lg pr-4 ${activeIndex === index ? 'text-emerald-700' : 'text-slate-800'}`}>
                                            {faq.question}
                                        </span>
                                        <span className={`p-2 rounded-full shrink-0 transition-colors ${activeIndex === index ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
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
                        <div className="space-y-6">
                            {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, i) => {
                                const index = i + Math.ceil(faqs.length / 2);
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="border border-slate-200 rounded-xl overflow-hidden h-fit bg-white hover:shadow-md transition-shadow"
                                    >
                                        <button
                                            onClick={() => toggleFAQ(index)}
                                            className={`w-full flex items-center justify-between p-6 text-left transition-colors ${activeIndex === index ? 'bg-slate-50' : 'bg-white'
                                                }`}
                                        >
                                            <span className={`font-semibold text-lg pr-4 ${activeIndex === index ? 'text-emerald-700' : 'text-slate-800'}`}>
                                                {faq.question}
                                            </span>
                                            <span className={`p-2 rounded-full shrink-0 transition-colors ${activeIndex === index ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
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
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="max-w-xl mx-auto text-center"
                >
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-xl mb-3 text-slate-800">Still have questions?</h3>
                        <p className="text-slate-600 mb-6">Can't find the answer you're looking for? Feel free to contact me directly.</p>
                        <a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors gap-2"
                        >
                            Contact Me <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </motion.div> */}
            </div>
        </section>
    );
};

export default FAQ;
