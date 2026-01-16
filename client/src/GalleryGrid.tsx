import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ArtworkCard from "./ArtworkCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import type { Artwork } from "@/lib/shopify-transform";

interface GalleryGridProps {
  onViewDetail: (artwork: Artwork) => void;
}

export default function GalleryGrid({ onViewDetail }: GalleryGridProps) {
  const [sortBy, setSortBy] = useState("default");
  const [displayCount, setDisplayCount] = useState(12);
  
  // Fetch artworks from Shopify
  const { artworks: allArtworks, isLoading, error } = useShopifyProducts();

  // Sort artworks
  const sortedArtworks = useMemo(() => {
    if (!allArtworks) return [];
    
    const artworks = [...allArtworks];
    
    switch (sortBy) {
      case "price-low":
        return artworks.sort((a, b) => a.price - b.price);
      case "price-high":
        return artworks.sort((a, b) => b.price - a.price);
      case "title":
        return artworks.sort((a, b) => a.title.localeCompare(b.title));
      case "artist":
        return artworks.sort((a, b) => a.artist.localeCompare(b.artist));
      default:
        return artworks;
    }
  }, [allArtworks, sortBy]);

  // Display limited artworks
  const displayedArtworks = sortedArtworks.slice(0, displayCount);
  const hasMore = sortedArtworks.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 12, sortedArtworks.length));
  };

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 bg-dark">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 mb-4 text-xs tracking-widest uppercase bg-purple-600/30 backdrop-blur-sm text-purple-300 rounded-full border border-purple-500/30">
                The Gallery
              </span>
              <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4">
                Explore Our Collection
              </h2>
              <p className="text-white/60 text-lg">Loading artworks...</p>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="py-20 bg-dark">
        <div className="container">
          <div className="text-center">
            <p className="text-red-500">Error loading gallery: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-dark">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-xs tracking-widest uppercase bg-purple-600/30 backdrop-blur-sm text-purple-300 rounded-full border border-purple-500/30">
              The Gallery
            </span>
            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4">
              Explore Our Collection
            </h2>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <p className="text-white/60 text-sm">
              Showing {displayedArtworks.length} of {sortedArtworks.length} artworks
            </p>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] glass-card border-white/10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="title">Title: A to Z</SelectItem>
              <SelectItem value="artist">Artist: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gallery Grid - Square aspect ratio for homepage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {displayedArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.05,
                ease: "easeOut"
              }}
            >
              <ArtworkCard 
                artwork={artwork} 
                onClick={onViewDetail}
                aspectRatio="square"
              />
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
