import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  initials: string;
  color: string;
}

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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
    },
    {
      id: 5,
      quote: "Coach exceptionnel! Il a su corriger mon service en seulement quelques leçons. Je le recommande vivement à tous ceux qui veulent passer au niveau supérieur à Montréal.",
      name: "Marc T.",
      title: "Amateur Player",
      initials: "MT",
      color: "bg-teal-600"
    },
    {
      id: 6,
      quote: "Sakka brings an incredible energy to every session. Training with him at Parc Jeanne-Mance has been a real game-changer for my fitness and tennis IQ.",
      name: "David L.",
      title: "Advanced Player",
      initials: "DL",
      color: "bg-rose-600"
    },
    {
      id: 7,
      quote: "I started as an absolute beginner and now I can confidently rally and play matches. Anis' patience and structured teaching approach are truly unmatched.",
      name: "Sarah C.",
      title: "Beginner",
      initials: "SC",
      color: "bg-indigo-600"
    },
    {
      id: 8,
      quote: "Anis has an incredible eye for technical details. His competitive mindset and intensive drills were exactly what I needed to prepare for my collegiate season.",
      name: "Alex V.",
      title: "College Athlete",
      initials: "AV",
      color: "bg-cyan-600"
    },
    {
      id: 9,
      quote: "Super expérience ! Un entraîneur très professionnel qui adapte complètement ses séances selon notre niveau et de manière très ludique. Mes enfants adorent leurs cours avec lui.",
      name: "Julie R.",
      title: "Parent",
      initials: "JR",
      color: "bg-fuchsia-600"
    }
  ];

  return (
    <section className="pt-16 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-2">What Players Say About Me</h2>
          
          <div className="hidden md:flex gap-4">
            <button
              onClick={scrollPrev}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="flex-[0_0_100%] md:flex-[0_0_50%] pl-4 md:pl-8 min-w-0"
              >
                <div className="glass-panel-dark h-full p-8 md:p-10 rounded-2xl relative overflow-hidden flex flex-col justify-between border border-white/5">
                  <div className="absolute top-4 right-6 text-7xl font-serif text-white/5 select-none leading-none">"</div>
                  
                  <div>
                    <div className="flex gap-1 mb-6">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className="w-5 h-5 text-amber-400 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <blockquote className="text-xl md:text-2xl font-light md:leading-relaxed mb-8 text-white/90 relative z-10 italic">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>

                  <div className="flex items-center mt-auto border-t border-white/10 pt-6">
                    <div className={`w-14 h-14 rounded-full mr-5 flex items-center justify-center text-white font-bold text-xl shadow-lg ${testimonial.color}`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-medium text-white text-lg tracking-wide">{testimonial.name}</div>
                      <div className="text-emerald-400 font-medium text-sm tracking-widest uppercase mt-1">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile controls */}
        <div className="flex justify-center gap-4 mt-8 md:hidden">
          <button
            onClick={scrollPrev}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
