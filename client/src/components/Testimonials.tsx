import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  initials: string;
  color: string;
}

const Testimonials = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Perfect! Anis is amazing, I learned about the technical problems I have to correct faster than ever before. At first, I didn't know how to change my posture, the grip and other things but Anis knew exactly how to explain each and every detail, many of which I have not been told before by other tennis coaches. He cares about the basics and if you are truly motivated... you will improve a tenfold, immediately.",
      name: "Richard",
      title: "Student",
      initials: "R",
      color: "bg-emerald-600"
    },
    {
      id: 2,
      quote: "Perfect! Honestly one of the most fun coaches to play with, he teaches you how to read the court properly, and he keeps making you reach your limit. He really focuses on the game aspect, you see so many player that can hit good shots during practice, but when you put them in a match they lose everything... however Anis prepares you very well in increasing your experience during matches.",
      name: "Ziad",
      title: "Student",
      initials: "Z",
      color: "bg-blue-600"
    },
    {
      id: 3,
      quote: "Perfect! Anis is an amazing tennis coach!! He adapts to your level really well, challenges you to do better, and praises you to keep you going! thanks so much, Anis!",
      name: "Cristina",
      title: "Student",
      initials: "C",
      color: "bg-amber-600"
    },
    {
      id: 4,
      quote: "Sakka is an exceptional coach who truly understands the game. He helped me improve my technique dramatically and gave me the confidence to compete at higher levels. His personalized approach and patience made all the difference in my tennis journey.",
      name: "Lina Soussi",
      title: "National Champion - Tunisia",
      initials: "LS",
      color: "bg-purple-600"
    },
    {
      id: 5,
      quote: "Perfect! Anis is truly awesome. He is very experienced, patient, professional and gives great feedback. Truly outstanding coach!",
      name: "Sara",
      title: "Student",
      initials: "S",
      color: "bg-fuchsia-600"
    },
    {
      id: 6,
      quote: "Working with Sakka transformed my game. He has a unique ability to identify weaknesses and create targeted training plans. His strategic insights during matches have helped me win tournaments I thought were out of reach. I highly recommend him to any serious player.",
      name: "Rined Saafi",
      title: "National Champion - Tunisia",
      initials: "RS",
      color: "bg-cyan-600"
    },
    {
      id: 7,
      quote: "As a parent, I was impressed by Sakka's professionalism and dedication to my child's development. He not only improved her technical skills but also built her mental toughness and love for the game. The progress has been remarkable in just a few months.",
      name: "Fatima B.",
      title: "Parent of Young Player",
      initials: "FB",
      color: "bg-teal-600"
    },
    {
      id: 8,
      quote: "Sakka brought international-level coaching to our club. His experience and passion are contagious. The way he develops young talent while maintaining their love for the sport is truly special. Our team's performance improved significantly under his leadership.",
      name: "Club Director",
      title: "Monastir Tennis Club",
      initials: "CD",
      color: "bg-indigo-600"
    },
    {
      id: 9,
      quote: "Perfect! Anis was very encouraging and patient. Highly recommend!",
      name: "Yera",
      title: "Student",
      initials: "Y",
      color: "bg-rose-600"
    }
  ];

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Get current chunk
  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="pt-4 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-medium text-white">What Players Say About Me</h2>
          
          {totalPages > 1 && (
            <div className="flex gap-4">
              <button
                onClick={prevPage}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center border border-white/5"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center text-white/50 text-sm font-medium px-2">
                {currentPage + 1} / {totalPages}
              </div>
              <button
                onClick={nextPage}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center border border-white/5"
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        
        <div className="relative min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {currentTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="glass-panel-dark p-6 rounded-2xl break-inside-avoid mb-6 relative overflow-hidden border border-white/5 h-fit"
                >
                  {/* Decorative quote mark */}
                  <div className="absolute top-2 right-4 text-5xl font-serif text-white/5 select-none leading-none">"</div>
                  
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className="w-4 h-4 text-amber-400 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="text-base font-light leading-relaxed mb-6 text-white/90 relative z-10 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center border-t border-white/10 pt-4 mt-auto">
                    <div className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center text-white font-bold text-sm shadow-lg ${testimonial.color}`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-medium text-white text-base tracking-wide">{testimonial.name}</div>
                      <div className="text-emerald-400 font-medium text-xs tracking-widest uppercase mt-0.5">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
