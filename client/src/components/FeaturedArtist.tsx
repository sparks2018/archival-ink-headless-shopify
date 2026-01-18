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
          <span className="text-xs tracking-widest uppercase text-purple-600 mb-2 block">
            Featured Artist
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Alex Grey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the visionary works of one of the most influential contemporary artists
          </p>
        </motion.div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            >
              <ArtworkCard artwork={artwork} onViewDetail={onViewDetail} aspectRatio="portrait" theme="light" />
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
