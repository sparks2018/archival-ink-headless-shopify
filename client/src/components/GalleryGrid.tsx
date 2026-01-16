import { useState } from "react";
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

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  soldOut?: boolean;
}

const galleryArtworks: Artwork[] = [
  {
    id: "g-1",
    title: "2012",
    artist: "Michael Pukac",
    price: 75,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=600&fit=crop",
    category: "Contemporary",
  },
  {
    id: "g-2",
    title: "21st Century Goddess",
    artist: "Yurik Riegel",
    price: 50,
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=600&fit=crop",
    category: "Contemporary",
  },
  {
    id: "g-3",
    title: "Allegory of Complacency",
    artist: "Mear One",
    price: 300,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop",
    category: "Street Art",
  },
  {
    id: "g-4",
    title: "Andrea",
    artist: "David Lawell",
    price: 25,
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&h=600&fit=crop",
    category: "Contemporary",
  },
  {
    id: "g-5",
    title: "Apotheosis",
    artist: "Luke Brown",
    price: 777.77,
    originalPrice: 250,
    image: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&h=600&fit=crop",
    category: "Visionary Art",
  },
  {
    id: "g-6",
    title: "Archer",
    artist: "John Park",
    price: 150,
    image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600&h=600&fit=crop",
    category: "Classical",
  },
  {
    id: "g-7",
    title: "Balance of the Upsets",
    artist: "John Park",
    price: 50,
    image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=600&h=600&fit=crop",
    category: "Classical",
  },
  {
    id: "g-8",
    title: "Bel Air",
    artist: "Hans Haveron",
    price: 100,
    image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=600&h=600&fit=crop",
    category: "Contemporary",
  },
  {
    id: "g-9",
    title: "Black Madonna",
    artist: "Jake Kobrin",
    price: 0,
    image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&h=600&fit=crop",
    category: "Contemporary",
    soldOut: true,
  },
  {
    id: "g-10",
    title: "Buddha of Infinite Bliss",
    artist: "Christopher Pugliese",
    price: 300,
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=600&fit=crop",
    category: "Visionary Art",
  },
  {
    id: "g-11",
    title: "Burst of Light",
    artist: "Rachel Mandala",
    price: 125,
    image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=600&fit=crop",
    category: "Visionary Art",
  },
  {
    id: "g-12",
    title: "Caduceus",
    artist: "Hans Haveron",
    price: 100,
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=600&fit=crop",
    category: "Contemporary",
  },
  {
    id: "g-13",
    title: "Collective Vision",
    artist: "Alex Grey",
    price: 3500,
    image: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&h=600&fit=crop",
    category: "Visionary Art",
  },
  {
    id: "g-14",
    title: "Crystalline Wolf Totem",
    artist: "Mugwort",
    price: 179,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    category: "Digital Art",
  },
  {
    id: "g-15",
    title: "Diamond Being",
    artist: "Alex Grey",
    price: 3000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    category: "Visionary Art",
  },
  {
    id: "g-16",
    title: "Divine Imagination",
    artist: "Stella Strzyzowska",
    price: 200,
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?w=600&h=600&fit=crop",
    category: "Visionary Art",
  },
];

interface GalleryGridProps {
  onViewDetail?: (artwork: Artwork) => void;
}

export default function GalleryGrid({ onViewDetail }: GalleryGridProps) {
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(12);

  const sortedArtworks = [...galleryArtworks].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  const visibleArtworks = sortedArtworks.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, galleryArtworks.length));
  };

  return (
    <section className="py-20 relative">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-xs tracking-widest uppercase text-purple-400 mb-2 block">
              The Gallery
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white">
              Explore Our Collection
            </h2>
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] glass-card border-white/20 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="default" className="text-white hover:bg-white/10">
                Default
              </SelectItem>
              <SelectItem value="price-low" className="text-white hover:bg-white/10">
                Price, low to high
              </SelectItem>
              <SelectItem value="price-high" className="text-white hover:bg-white/10">
                Price, high to low
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
          {visibleArtworks.map((artwork, index) => (
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

        {/* Load More Button */}
        {visibleCount < galleryArtworks.length && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={loadMore}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12"
            >
              Load More
            </Button>
          </motion.div>
        )}

        {/* Pagination Info */}
        <div className="text-center mt-6">
          <span className="text-white/60 text-sm">
            Showing {visibleCount} of {galleryArtworks.length} artworks
          </span>
        </div>
      </div>
    </section>
  );
}
