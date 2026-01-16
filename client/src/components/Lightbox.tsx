import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn, ZoomOut, Heart, ShoppingCart, Home } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ViewInRoom from "@/components/ViewInRoom";
import ArtworkComments from "@/components/ArtworkComments";
import ViewMoreFromArtist from "@/components/ViewMoreFromArtist";
import ExploreOtherArtists from "@/components/ExploreOtherArtists";

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

interface LightboxProps {
  artwork: Artwork;
  onClose: () => void;
  onArtworkChange?: (artwork: Artwork) => void;
}

export default function Lightbox({ artwork, onClose, onArtworkChange }: LightboxProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [heartBounce, setHeartBounce] = useState(false);
  const [showViewInRoom, setShowViewInRoom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleFavoriteClick = () => {
    toggleFavorite(artwork);
    setHeartBounce(true);
    setTimeout(() => setHeartBounce(false), 400);
    
    if (!isFavorite(artwork.id)) {
      toast.success("Added to favorites");
    } else {
      toast("Removed from favorites");
    }
  };

  const handleAddToCart = () => {
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

  const handleViewInRoom = () => {
    setShowViewInRoom(true);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-start justify-center overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Image */}
            <div className="relative">
              <div
                className="relative bg-black rounded-lg overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: scale > 1 ? "move" : "default" }}
              >
                <motion.img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-auto"
                  style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    transition: isDragging ? "none" : "transform 0.3s ease",
                  }}
                />

                {/* Zoom Controls */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-lg backdrop-blur-sm transition-colors"
                    disabled={scale >= 3}
                  >
                    <ZoomIn className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-lg backdrop-blur-sm transition-colors"
                    disabled={scale <= 1}
                  >
                    <ZoomOut className="w-5 h-5 text-white" />
                  </button>
                  <span className="px-3 py-2 bg-black/50 rounded-lg backdrop-blur-sm text-white text-sm font-medium">
                    {Math.round(scale * 100)}%
                  </span>
                </div>

                {/* Close Buttons */}
                {/* Main purple filled button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-3 bg-purple-600 hover:bg-purple-700 rounded-full backdrop-blur-sm transition-all shadow-lg hover:shadow-purple-500/50 z-50"
                  aria-label="Close lightbox"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

              </div>

              <p className="text-center text-gray-400 text-sm mt-4">
                Press <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> to close,{" "}
                <kbd className="px-2 py-1 bg-white/10 rounded">+</kbd>/
                <kbd className="px-2 py-1 bg-white/10 rounded">-</kbd> to zoom
              </p>
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-medium rounded-full uppercase tracking-wide mb-3">
                  {artwork.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-2">{artwork.title}</h2>
                <p className="text-gray-400">
                  by{" "}
                  <a 
                    href={`/artist/${artwork.artist.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    {artwork.artist}
                  </a>
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">${artwork.price}</span>
                {artwork.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${artwork.originalPrice}</span>
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 text-sm font-medium rounded">
                      Save ${artwork.originalPrice - artwork.price}
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={artwork.soldOut}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-6 text-base"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {artwork.soldOut ? "Sold Out" : "Add to Cart"}
                </Button>

                <Button
                  onClick={handleViewInRoom}
                  variant="outline"
                  className="w-full border-white/20 hover:bg-white/10 text-white font-medium py-6 text-base"
                >
                  <Home className="w-5 h-5 mr-2" />
                  View in Room
                </Button>
              </div>

              <Button
                onClick={handleFavoriteClick}
                variant="outline"
                className={`w-full border-white/20 hover:bg-white/10 font-medium py-6 text-base transition-all ${
                  isFavorite(artwork.id) ? "text-red-500 border-red-500/50" : "text-white"
                }`}
              >
                <Heart
                  className={`w-5 h-5 mr-2 transition-all ${
                    heartBounce ? "scale-125" : ""
                  } ${isFavorite(artwork.id) ? "fill-current" : ""}`}
                />
                {isFavorite(artwork.id) ? "Remove from Favorites" : "Add to Favorites"}
              </Button>

              {/* About this piece */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">About this piece</h3>
                <p className="text-gray-300 leading-relaxed">
                  A stunning work from {artwork.artist}'s collection. This {artwork.category.toLowerCase()} captures
                  the essence of visionary art, blending intricate detail with transcendent imagery.
                </p>
              </div>

              {/* Comments Section */}
              <div className="pt-6 border-t border-white/10">
                <ArtworkComments artworkId={artwork.id} />
              </div>
            </div>
          </div>

          {/* View More From This Artist */}
          <ViewMoreFromArtist 
            artistName={artwork.artist} 
            currentArtworkId={artwork.id}
            onArtworkClick={(newArtwork) => {
              onArtworkChange?.(newArtwork);
            }}
          />

          {/* Explore Other Artists */}
          <ExploreOtherArtists 
            currentArtist={artwork.artist}
            onArtworkClick={(newArtwork) => {
              onArtworkChange?.(newArtwork);
            }}
          />
        </div>
      </motion.div>

      {/* View in Room Modal - Rendered outside to avoid z-index issues */}
      {showViewInRoom && (
        <ViewInRoom
          isOpen={showViewInRoom}
          onClose={() => setShowViewInRoom(false)}
          artworkImage={artwork.image}
          artworkTitle={artwork.title}
          artistName={artwork.artist}
        />
      )}
    </>
  );
}
