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

                {/* Hover Overlay with Icons */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to favorites logic
                    }}
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArtworkClick?.(artwork);
                    }}
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic
                    }}
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
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
