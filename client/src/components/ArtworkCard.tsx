import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Eye, ZoomIn } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface ArtworkCardProps {
  artwork: Artwork;
  onViewDetail?: (artwork: Artwork) => void;
  onClick?: (artwork: Artwork) => void;
  aspectRatio?: 'square' | 'portrait';
  theme?: 'dark' | 'light';
}

export default function ArtworkCard({ artwork, onViewDetail, onClick, aspectRatio = 'square', theme = 'dark' }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [heartBounce, setHeartBounce] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart, isInCart } = useCart();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(artwork);
    setHeartBounce(true);
    setTimeout(() => setHeartBounce(false), 400);
    
    if (!isFavorite(artwork.id)) {
      toast.success("Added to favorites");
    } else {
      toast("Removed from favorites");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (artwork.soldOut) {
      toast.error("This artwork is sold out");
      return;
    }
    addToCart({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      price: artwork.price,
      image: artwork.image,
    });
    toast.success("Added to cart");
  };

  const handleViewDetail = () => {
    if (onClick) {
      onClick(artwork);
    } else if (onViewDetail) {
      onViewDetail(artwork);
    }
  };

  const hasDiscount = artwork.originalPrice && artwork.originalPrice > artwork.price;

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'glass-card'} rounded-xl overflow-hidden shadow-lg`}>
        {/* Image Container - Clickable to open lightbox */}
        <div 
          className={`relative ${aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden cursor-pointer`}
          onClick={handleViewDetail}
        >
          <motion.img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Zoom indicator on hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered && !artwork.soldOut ? 0.9 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-medium tracking-widest uppercase bg-purple-600/80 backdrop-blur-sm text-white rounded-full">
              {artwork.category}
            </span>
          </div>

          {/* Favorite Button */}
          <motion.button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFavorite(artwork.id)
                ? "bg-red-500 text-white"
                : "bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
            }`}
            animate={heartBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite(artwork.id) ? "fill-current" : ""}`}
            />
          </motion.button>

          {/* Sold Out Badge */}
          {artwork.soldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-red-600 text-white font-semibold tracking-wider uppercase rounded">
                Sold Out
              </span>
            </div>
          )}

          {/* Hover Actions */}
          <AnimatePresence>
            {isHovered && !artwork.soldOut && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 flex gap-2"
              >
                <Button
                  onClick={handleViewDetail}
                  className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className={`font-playfair text-lg font-semibold mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {artwork.title}
          </h3>
          <p className={`text-sm mb-3 ${
            theme === 'light' ? 'text-gray-600' : 'text-white/60'
          }`}>
            by{" "}
            <a 
              href={`/artist/${artwork.artist.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-purple-600 transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {artwork.artist}
            </a>
          </p>
          
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              ${artwork.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className={`text-sm line-through ${
                theme === 'light' ? 'text-gray-400' : 'text-white/40'
              }`}>
                ${artwork.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-xl -z-10"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
