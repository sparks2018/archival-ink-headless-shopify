import { motion } from "framer-motion";
import ArtworkCard from "./ArtworkCard";
import { useShopifyProducts, type Artwork } from "@/hooks/useShopifyProducts";

interface FeaturedArtistProps {
  onViewDetail?: (artwork: Artwork) => void;
}

export default function FeaturedArtist({ onViewDetail }: FeaturedArtistProps) {
  const { artworks } = useShopifyProducts();
  
  // Filter artworks by Alex Grey (or get first 8 artworks as featured)
  const featuredArtworks = artworks
    ?.filter(art => art.artist.toLowerCase().includes('alex grey'))
    .slice(0, 8) || [];

  // If no Alex Grey artworks, use first 8 artworks
  const displayArtworks = featuredArtworks.length > 0 ? featuredArtworks : (artworks?.slice(0, 8) || []);

  if (displayArtworks.length === 0) {
    return null;
  }

  return (
    <section className="py-20 relative">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-widest uppercase text-purple-400 mb-2 block">
            Featured Artist
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Alex Grey
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Explore the visionary works of one of the most influential contemporary artists
          </p>
        </motion.div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            >
              <ArtworkCard artwork={artwork} onViewDetail={onViewDetail} aspectRatio="portrait" />
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => {
              const artistsSection = document.getElementById('artists');
              if (artistsSection) {
                artistsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            Explore Collection
          </button>
        </motion.div>
      </div>
    </section>
  );
}
