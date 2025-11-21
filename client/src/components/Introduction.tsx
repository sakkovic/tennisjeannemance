import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Introduction = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const cyclingTexts = [
    "develop young talent",
    "improve technique and form",
    "build competitive confidence", 
    "master strategic play",
    "enhance athletic performance",
    "prepare for tournaments",
    "refine tactical skills",
    "unlock player potential"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % cyclingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cyclingTexts.length]);

  return (
    <section className="pt-20 pb-4 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-4xl md:text-6xl lg:text-7xl font-medium mb-8 leading-tight">
            <span className="text-white">I help players </span>
            <div className="inline-block h-20 md:h-24 lg:h-28 align-top">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTextIndex}
                  className="text-brand-accent block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {cyclingTexts[currentTextIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl leading-relaxed font-light">
            Whether you're a beginner looking to learn the basics or a competitive player aiming for excellence, 
            I provide personalized coaching tailored to your goals and skill level.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Introduction;

