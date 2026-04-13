import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  initials: string;
  color: string;
}

const Testimonials = () => {
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
      quote: "Perfect! Anis is truly awesome. He is very experienced, patient, professional and gives great feedback. Truly outstanding coach!",
      name: "Sara",
      title: "Student",
      initials: "S",
      color: "bg-purple-600"
    },
    {
      id: 5,
      quote: "Perfect! Anis was very encouraging and patient. Highly recommend!",
      name: "Yera",
      title: "Student",
      initials: "Y",
      color: "bg-rose-600"
    }
  ];

  return (
    <section className="pt-16 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-medium mb-12 text-white">What Players Say About Me</h2>
        
        {/* Changed layout from columns-1 md:columns-2 to columns-1 sm:columns-2 lg:columns-3 */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="glass-panel-dark p-6 rounded-2xl break-inside-avoid mb-6 relative overflow-hidden border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
              viewport={{ once: true }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
