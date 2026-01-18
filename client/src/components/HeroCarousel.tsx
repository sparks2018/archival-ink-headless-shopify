import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface HeroCarouselProps {
  onSlideChange?: () => void;
}

interface HeroSlide {
  id: string;
  title: string;
  artist: string;
  artistSlug: string;
  desktopImage: string;
  desktopImageWebP: string;
  mobileImage: string;
  mobileImageWebP: string;
  category: string;
  inInventory: boolean;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "1",
    title: "Apotheosis of Hope",
    artist: "Michael Divine",
    artistSlug: "michael-divine",
    desktopImage: "/slider/Michael_Divine-Apotheosis_of_Hope-Desktop.jpg",
    desktopImageWebP: "/slider/Michael_Divine-Apotheosis_of_Hope-Desktop.webp",
    mobileImage: "/slider/Michael_Divine-Apotheosis_of_Hope-Mobile.jpg",
    mobileImageWebP: "/slider/Michael_Divine-Apotheosis_of_Hope-Mobile.webp",
    category: "Visionary Art",
    inInventory: true
  },
  {
    id: "2",
    title: "Anatomical Consciousness",
    artist: "Alex Grey",
    artistSlug: "alex-grey",
    desktopImage: "/slider/Alex_Grey-Anatomical_Consciousness-Desktop.jpg",
    desktopImageWebP: "/slider/Alex_Grey-Anatomical_Consciousness-Desktop.webp",
    mobileImage: "/slider/Alex_Grey-Anatomical_Consciousness-Mobile.jpg",
    mobileImageWebP: "/slider/Alex_Grey-Anatomical_Consciousness-Mobile.webp",
    category: "Visionary Art",
    inInventory: true
  },
  {
    id: "3",
    title: "Diamond Being",
    artist: "Alex Grey",
    artistSlug: "alex-grey",
    desktopImage: "/slider/Alex_Grey-Diamond_Being-Desktop.jpg",
    desktopImageWebP: "/slider/Alex_Grey-Diamond_Being-Desktop.webp",
    mobileImage: "/slider/Alex_Grey-Diamond_Being-Mobile.jpg",
    mobileImageWebP: "/slider/Alex_Grey-Diamond_Being-Mobile.webp",
    category: "Sacred Geometry",
    inInventory: true
  },
  {
    id: "4",
    title: "Cosmic Hummingbird",
    artist: "Unknown Artist",
    artistSlug: "",
    desktopImage: "/slider/Cosmic_Hummingbird-Desktop.jpg",
    desktopImageWebP: "/slider/Cosmic_Hummingbird-Desktop.webp",
    mobileImage: "/slider/Cosmic_Hummingbird-Mobile.jpg",
    mobileImageWebP: "/slider/Cosmic_Hummingbird-Mobile.webp",
    category: "Featured Artwork",
    inInventory: false
  },
  {
    id: "5",
    title: "Silk (Hand Embellished)",
    artist: "Hans Haveron",
    artistSlug: "hans-haveron",
    desktopImage: "/slider/Hans_Haveron-Silk_Hand_Embellished-Desktop.jpg",
    desktopImageWebP: "/slider/Hans_Haveron-Silk_Hand_Embellished-Desktop.webp",
    mobileImage: "/slider/Hans_Haveron-Silk_Hand_Embellished-Mobile.jpg",
    mobileImageWebP: "/slider/Hans_Haveron-Silk_Hand_Embellished-Mobile.webp",
    category: "Contemporary Art",
    inInventory: true
  },
  {
    id: "6",
    title: "Chiaro",
    artist: "John Park",
    artistSlug: "john-park",
    desktopImage: "/slider/John_Park-Chiaro-Desktop.jpg",
    desktopImageWebP: "/slider/John_Park-Chiaro-Desktop.webp",
    mobileImage: "/slider/John_Park-Chiaro-Mobile.jpg",
    mobileImageWebP: "/slider/John_Park-Chiaro-Mobile.webp",
    category: "Mixed Media",
    inInventory: true
  },
  {
    id: "7",
    title: "Apotheosis",
    artist: "Luke Brown",
    artistSlug: "luke-brown",
    desktopImage: "/slider/Luke_Brown-Apotheosis-Desktop.jpg",
    desktopImageWebP: "/slider/Luke_Brown-Apotheosis-Desktop.webp",
    mobileImage: "/slider/Luke_Brown-Apotheosis-Mobile.jpg",
    mobileImageWebP: "/slider/Luke_Brown-Apotheosis-Mobile.webp",
    category: "Psychedelic Art",
    inInventory: true
  },
  {
    id: "8",
    title: "Psychedelic Goddess",
    artist: "Unknown Artist",
    artistSlug: "",
    desktopImage: "/slider/Psychedelic_Goddess-Desktop.jpg",
    desktopImageWebP: "/slider/Psychedelic_Goddess-Desktop.webp",
    mobileImage: "/slider/Psychedelic_Goddess-Mobile.jpg",
    mobileImageWebP: "/slider/Psychedelic_Goddess-Mobile.webp",
    category: "Featured Artwork",
    inInventory: false
  },
  {
    id: "9",
    title: "Thermal Vision",
    artist: "Unknown Artist",
    artistSlug: "",
    desktopImage: "/slider/Thermal_Figure-Desktop.jpg",
    desktopImageWebP: "/slider/Thermal_Figure-Desktop.webp",
    mobileImage: "/slider/Thermal_Figure-Mobile.jpg",
    mobileImageWebP: "/slider/Thermal_Figure-Mobile.webp",
    category: "Featured Artwork",
    inInventory: false
  }
];

export default function HeroCarousel({ onSlideChange }: HeroCarouselProps) {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTimeout, setPauseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [kenBurnsDirection, setKenBurnsDirection] = useState({ x: 0, y: 0 });

  // Generate random Ken Burns direction for each slide
  const generateKenBurnsDirection = useCallback(() => {
    const directions = [
      { x: -3, y: -2 }, // top-left
      { x: 3, y: -2 },  // top-right
      { x: -3, y: 2 },  // bottom-left
      { x: 3, y: 2 },   // bottom-right
      { x: 0, y: -3 },  // top-center
      { x: 0, y: 3 },   // bottom-center
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }, []);

  const heroSlides = HERO_SLIDES;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setKenBurnsDirection(generateKenBurnsDirection());
    onSlideChange?.();
  }, [heroSlides.length, onSlideChange, generateKenBurnsDirection]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setKenBurnsDirection(generateKenBurnsDirection());
    onSlideChange?.();
  }, [heroSlides.length, onSlideChange, generateKenBurnsDirection]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setKenBurnsDirection(generateKenBurnsDirection());
    onSlideChange?.();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    
    // Clear existing timeout if any
    if (pauseTimeout) {
      clearTimeout(pauseTimeout);
      setPauseTimeout(null);
    }
    
    // If pausing, set timeout to auto-resume after 20 seconds
    if (!isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setPauseTimeout(null);
      }, 20000);
      setPauseTimeout(timeout);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 9000); // Changed from 8000 to 9000 (9 seconds)
      return () => clearInterval(interval);
    }
  }, [nextSlide, isPaused]);

  // Cleanup pause timeout on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeout) {
        clearTimeout(pauseTimeout);
      }
    };
  }, [pauseTimeout]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction > 0 ? -300 : 300,  // Right arrow (direction=1): exit LEFT (-300), Left arrow (direction=-1): exit RIGHT (300)
      opacity: 0,
    }),
  };

  // Ken Burns effect variants for the image
  const kenBurnsVariants = {
    initial: {
      scale: 1,
      x: 0,
      y: 0,
    },
    animate: (direction: { x: number; y: number }) => ({
      scale: 0.94,
      x: direction.x,
      y: direction.y,
    }),
  };

  const currentSlideData = heroSlides[currentSlide];

  const handleViewArtistClick = () => {
    if (currentSlideData.artistSlug) {
      setLocation(`/artist/${currentSlideData.artistSlug}`);
    }
  };

  const handleViewCollectionClick = () => {
    setLocation('/gallery');
  };

  const handleSubmitArtClick = () => {
    setLocation('/submit-art');
  };

  return (
    <section 
      className="relative h-screen w-full overflow-hidden pt-28"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          <motion.div 
            className="absolute inset-0"
            custom={kenBurnsDirection}
            variants={kenBurnsVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 9,
              ease: "linear",
            }}
          >
            <picture>
              <source media="(max-width: 767px)" type="image/webp" srcSet={currentSlideData.mobileImageWebP} />
              <source media="(max-width: 767px)" srcSet={currentSlideData.mobileImage} />
              <source type="image/webp" srcSet={currentSlideData.desktopImageWebP} />
              <img
                src={currentSlideData.desktopImage}
                alt={currentSlideData.title}
                className="w-full h-full object-cover"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>

          <div className="relative h-full flex items-end pb-20">
            <div className="container px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-left max-w-2xl"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-block mb-3"
                >
                  <span className="px-3 py-1.5 rounded-full bg-purple-600/40 backdrop-blur-md border border-purple-400/40 text-purple-200 text-xs font-medium uppercase tracking-wider">
                    {currentSlideData.artist}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                >
                  {currentSlideData.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-base md:text-lg text-white/90 mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                >
                  {currentSlideData.inInventory ? (
                    <span>{currentSlideData.category}</span>
                  ) : (
                    <span>Submit Your Own Artwork →</span>
                  )}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  {currentSlideData.inInventory ? (
                    <>
                      {currentSlideData.artistSlug && (
                        <Button
                          onClick={handleViewArtistClick}
                          size="default"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 text-sm rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                        >
                          View Artist
                        </Button>
                      )}
                      <Button
                        onClick={handleViewCollectionClick}
                        size="default"
                        variant="outline"
                        className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-md px-6 py-3 text-sm rounded-full"
                      >
                        View Full Archive >
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleSubmitArtClick}
                        size="default"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 text-sm rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                      >
                        Submit Your Own Artwork
                      </Button>
                      <Button
                        onClick={handleViewCollectionClick}
                        size="default"
                        variant="outline"
                        className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-md px-6 py-3 text-sm rounded-full"
                      >
                        View Gallery
                      </Button>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-white"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3">
        <button
          onClick={togglePause}
          className="glass w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? (
            <Play className="w-4 h-4" fill="currentColor" style={{ pointerEvents: 'none' }} />
          ) : (
            <Pause className="w-4 h-4" fill="currentColor" style={{ pointerEvents: 'none' }} />
          )}
        </button>
        
        <div className="glass px-4 py-2 rounded-full">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {heroSlides.length}
          </span>
        </div>
      </div>
    </section>
  );
}
