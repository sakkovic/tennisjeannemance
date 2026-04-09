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
      quote: "Sakka is an exceptional coach who truly understands the game. He helped me improve my technique dramatically and gave me the confidence to compete at higher levels. His personalized approach and patience made all the difference in my tennis journey.",
      name: "Lina Soussi",
      title: "National Champion - Tunisia",
      initials: "LS",
      color: "bg-emerald-600"
    },
    {
      id: 2,
      quote: "Working with Sakka transformed my game. He has a unique ability to identify weaknesses and create targeted training plans. His strategic insights during matches have helped me win tournaments I thought were out of reach. I highly recommend him to any serious player.",
      name: "Rined Saafi",
      title: "National Champion - Tunisia",
      initials: "RS",
      color: "bg-blue-600"
    },
    {
      id: 3,
      quote: "As a parent, I was impressed by Sakka's professionalism and dedication to my child's development. He not only improved her technical skills but also built her mental toughness and love for the game. The progress has been remarkable in just a few months.",
      name: "Fatima B.",
      title: "Parent of Young Player",
      initials: "FB",
      color: "bg-amber-600"
    },
    {
      id: 4,
      quote: "Sakka brought international-level coaching to our club. His experience and passion are contagious. The way he develops young talent while maintaining their love for the sport is truly special. Our team's performance improved significantly under his leadership.",
      name: "Club Director",
      title: "Monastir Tennis Club",
      initials: "CD",
      color: "bg-purple-600"
    }
  ];

  return (
    <section className="pt-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-normal mb-12">What Players Say About Me</h2>
        <div className="columns-1 md:columns-2 gap-8 space-y-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="glass-panel-dark p-8 rounded-xl break-inside-avoid mb-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Decorative quote mark */}
              <div className="absolute top-4 right-6 text-6xl font-serif text-white/10 select-none leading-none">"</div>
              
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-lg mb-6 leading-relaxed text-white/90 relative z-10">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white font-bold text-sm ${testimonial.color}`}>
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-emerald-400 text-sm">{testimonial.title}</div>
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
