import { motion } from 'framer-motion';
import placeholderPerson from '../assets/placeholder-person.webp';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Sakka is an exceptional coach who truly understands the game. He helped me improve my technique dramatically and gave me the confidence to compete at higher levels. His personalized approach and patience made all the difference in my tennis journey.",
      name: "Lina Soussi",
      title: "National Champion - Tunisia",
      avatar: placeholderPerson
    },
    {
      id: 2,
      quote: "Working with Sakka transformed my game. He has a unique ability to identify weaknesses and create targeted training plans. His strategic insights during matches have helped me win tournaments I thought were out of reach. I highly recommend him to any serious player.",
      name: "Rined Saafi",
      title: "National Champion - Tunisia",
      avatar: placeholderPerson
    },
    {
      id: 3,
      quote: "As a parent, I was impressed by Sakka's professionalism and dedication to my child's development. He not only improved her technical skills but also built her mental toughness and love for the game. The progress has been remarkable in just a few months.",
      name: "Fatima B.",
      title: "Parent of Young Player",
      avatar: placeholderPerson
    },
    {
      id: 4,
      quote: "Sakka brought international-level coaching to our club. His experience and passion are contagious. The way he develops young talent while maintaining their love for the sport is truly special. Our team's performance improved significantly under his leadership.",
      name: "Club Director",
      title: "Monastir Tennis Club",
      avatar: placeholderPerson
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
              className="bg-brand-light/20 text-white p-8 rounded-xl break-inside-avoid mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
              viewport={{ once: true }}
            >
              <blockquote className="text-lg mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-teal-200 text-sm">{testimonial.title}</div>
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
