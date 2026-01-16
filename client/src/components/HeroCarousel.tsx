import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useLocation } from "wouter";

interface HeroCarouselProps {
  onSlideChange?: () => void;
}

export default function HeroCarousel({ onSlideChange }: HeroCarouselProps) {
  const { artworks } = useShopifyProducts();
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Get featured artworks for hero (first 4 artworks)
  // FIXED: Added optional chaining and fallback to handle undefined artworks
  const heroSlides = artworks?.slice(0, 4) || [];

  const nextSlide = useCallback(() => {
    if (heroSlides.length === 0) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    onSlideChange?.();
  }, [heroSlides.length, onSlideChange]);

  const prevSlide = useCallback(() => {
    if (heroSlides.length === 0) return;
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    onSlideChange?.();
  }, [heroSlides.length, onSlideChange]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    onSlideChange?.();
  };

  // Touch handlers for mobile swipe
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

  // Auto-rotation every 8 seconds
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide, heroSlides.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  if (heroSlides.length === 0) {
    return (
      <section className="relative h-screen w-full overflow-hidden pt-28">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-lg">Loading...</p>
        </div>
      </section>
    );
  }

  const currentSlideData = heroSlides[currentSlide];

  const handleExploreClick = () => {
    // Navigate to gallery page
    setLocation('/gallery');
  };

  const handleViewArtistClick = () => {
    // Navigate to the artist's page
    const artistSlug = currentSlideData.artist.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setLocation(`/artist/${artistSlug}`);
  };

  return (
    <section 
      className="relative h-screen w-full overflow-hidden pt-28"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
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
            scale: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className="w-full h-full object-cover"
            />
            {/* Subtle vignette for text readability - much lighter */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* Content - Repositioned to bottom-left */}
          <div className="relative h-full flex items-end pb-20">
            <div className="container px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-left max-w-2xl"
              >
                {/* Artist Badge */}
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

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                >
                  {currentSlideData.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-base md:text-lg text-white/90 mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                >
                  {currentSlideData.category}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    onClick={handleExploreClick}
                    size="default"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 text-sm rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Explore Collection
                  </Button>
                  <Button
                    onClick={handleViewArtistClick}
                    size="default"
                    variant="outline"
                    className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-md px-6 py-3 text-sm rounded-full"
                  >
                    View Artist
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
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

      {/* Slide Indicators */}
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

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-10 glass px-4 py-2 rounded-full">
        <span className="text-white text-sm font-medium">
          {currentSlide + 1} / {heroSlides.length}
        </span>
      </div>
    </section>
  );
}
