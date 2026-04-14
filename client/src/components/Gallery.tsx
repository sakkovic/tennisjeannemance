import { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';

interface GalleryImage {
  src: string;
  alt: string;
  description: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const images: GalleryImage[] = [
    {
      src: '/gallery/anis_anes_tunisia_champion_u15.jpeg',
      alt: 'Tunisia U15 Champion',
      description: 'Tunisia U15 Championship victory with Anes'
    },
    {
      src: '/gallery/anis_lina_maroc.jpeg',
      alt: 'Tournament in Morocco',
      description: 'Sparring session with Morocco champion Lina'
    },
    {
      src: '/gallery/anis_selim_benromdhan.jpeg',
      alt: 'With Selim Ben Romdhane',
      description: 'Training session with Selim Ben Romdhane'
    },
    {
      src: '/gallery/anis_belek_derek.jpeg',
      alt: 'Group session',
      description: 'Training session with Belek and Derek'
    },
    {
      src: '/gallery/anis_soff_sousse.jpeg',
      alt: 'Tournament in Sousse',
      description: 'Competition at Sousse Tennis Club'
    },
    {
      src: '/gallery/aea2f9fe-4433-4df0-a946-ee9bddaf6b41.jpg',
      alt: 'Outdoor court training',
      description: 'Training session with my students on the outdoor court'
    },
    {
      src: '/gallery/e1c1d9ab-8d61-4883-8214-c430b0bafbcf.jpg',
      alt: 'Champion with trophy',
      description: 'Victory celebration with one of my students'
    },
    {
      src: '/gallery/0a7f6124-43bd-4d87-b804-6e84e9b1412d.jpg',
      alt: 'Final match at Tunis Tennis Club',
      description: 'Final at the Tunis Tennis Club'
    },
    {
      src: '/gallery/8b001041-a0f7-4676-a76b-0beecb6f6f80.jpg',
      alt: 'Rogers Cup in Montreal',
      description: 'At Rogers Cup in Montreal — International experience'
    }
  ];

  return (
    <section id="gallery" className="section-dark px-6 py-12">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-medium mb-4 text-white">
              Photo Gallery
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl">
              Discover my training sessions, champion students, and career highlights as a coach.
            </p>
          </div>

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

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-8">
            {images.map((image, index) => (
              <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-8">
                <div
                  className="group relative overflow-hidden rounded-2xl cursor-pointer md:aspect-[4/3] aspect-[3/4] bg-gray-800" style={{height: '380px'}}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-medium text-lg">{image.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden justify-center gap-4 mt-8">
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
      </motion.div>

      {/* Modal pour afficher l'image en grand */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <div className="max-w-6xl w-full">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4 text-lg">
              {selectedImage.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
