import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";
import { motion } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { favorites } = useFavorites();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Galaxy Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/images/galaxy-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <Header />

      <main className="flex-1 relative z-10 pt-24 pb-16">
        <div className="container">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white">
                Your Favorites
              </h1>
            </div>
            <p className="text-white/60 text-lg">
              {favorites.length} {favorites.length === 1 ? "artwork" : "artworks"} saved
            </p>
          </motion.div>

          {/* Favorites Grid */}
          {favorites.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {favorites.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArtworkCard artwork={artwork} aspectRatio="portrait" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto"
            >
              <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h2 className="font-playfair text-2xl text-white mb-2">No favorites yet</h2>
              <p className="text-white/60 mb-6">
                Start exploring our gallery and save artworks you love by clicking the heart icon.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Explore Gallery
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
