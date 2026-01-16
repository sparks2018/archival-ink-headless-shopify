import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Button } from "@/components/ui/button";

interface ViewMoreFromArtistProps {
  artistName: string;
  currentArtworkId: string;
  onArtworkClick?: (artwork: any) => void;
}

export default function ViewMoreFromArtist({ artistName, currentArtworkId, onArtworkClick }: ViewMoreFromArtistProps) {
  const { artworks } = useShopifyProducts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter artworks by artist, excluding current artwork
  const artistArtworks = artworks
    ?.filter(artwork => 
      artwork.artist === artistName && 
      artwork.id !== currentArtworkId
    )
    .slice(0, 10) || [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (artistArtworks.length === 0) {
    return null;
  }

  return (
    <div className="pt-8 border-t border-white/10">
      <h3 className="text-2xl font-bold text-white mb-6">View More From {artistName}</h3>
      
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
          {artistArtworks.map((artwork) => (
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
