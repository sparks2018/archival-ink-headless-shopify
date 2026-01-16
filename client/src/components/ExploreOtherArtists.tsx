import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Button } from "@/components/ui/button";

interface ExploreOtherArtistsProps {
  currentArtist: string;
  onArtworkClick?: (artwork: any) => void;
}

export default function ExploreOtherArtists({ currentArtist, onArtworkClick }: ExploreOtherArtistsProps) {
  const { artworks } = useShopifyProducts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get top-selling artwork from each artist (excluding current artist)
  const topArtworksByArtist = useMemo(() => {
    if (!artworks) return [];

    const artistMap = new Map<string, any>();
    
    // Group artworks by artist and get the highest priced one
    artworks.forEach(artwork => {
      if (artwork.artist === currentArtist) return;
      
      const existing = artistMap.get(artwork.artist);
      if (!existing || artwork.price > existing.price) {
        artistMap.set(artwork.artist, artwork);
      }
    });

    // Convert to array and sort by price (highest first)
    return Array.from(artistMap.values())
      .sort((a, b) => b.price - a.price)
      .slice(0, 15); // Limit to 15 artists
  }, [artworks, currentArtist]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (topArtworksByArtist.length === 0) {
    return null;
  }

  return (
    <div className="pt-8 border-t border-white/10">
      <h3 className="text-2xl font-bold text-white mb-6">Explore Other Artists</h3>
      <p className="text-gray-400 text-sm mb-6">Top-selling pieces from our collection</p>
      
      <div className="relative group">
        {/* Left Arrow */}
        <Button
          onClick={() => scroll('left')}
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {topArtworksByArtist.map((artwork) => (
            <motion.div
              key={artwork.id}
              onClick={() => onArtworkClick?.(artwork)}
              className="flex-shrink-0 w-48 group/card cursor-pointer"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                
                {/* Artist Name Badge */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-white font-medium text-sm">{artwork.artist}</p>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-medium uppercase bg-purple-600/80 backdrop-blur-sm text-white rounded">
                    {artwork.category}
                  </span>
                </div>
              </div>
              
              <h4 className="text-white font-medium text-sm line-clamp-1 group-hover/card:text-purple-400 transition-colors">
                {artwork.title}
              </h4>
              <p className="text-white/60 text-xs">${artwork.price.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          onClick={() => scroll('right')}
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
