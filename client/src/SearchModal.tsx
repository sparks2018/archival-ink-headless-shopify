import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Link } from "wouter";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { products } = useShopifyProducts();

  // Filter products based on search query
  const filteredProducts = products?.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.artist.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }) || [];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById("search-input");
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-[60] flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-3xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              id="search-input"
              type="text"
              placeholder="Search artworks, artists, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-16 pr-16 py-6 text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto"
            >
              {filteredProducts.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {filteredProducts.slice(0, 10).map((product) => (
                    <Link
                      key={product.id}
                      href={`/?artwork=${product.id}`}
                      onClick={onClose}
                    >
                      <div className="flex gap-4 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{product.title}</h3>
                          <p className="text-sm text-gray-400">by {product.artist}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-purple-400 font-medium">${product.price}</span>
                            <span className="text-xs text-gray-500 uppercase">{product.category}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {filteredProducts.length > 10 && (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      Showing 10 of {filteredProducts.length} results
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
                  <p className="text-gray-400">Try searching for something else</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Quick Links */}
          {!searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Alex Grey", "Prints", "Visionary Art", "Contemporary", "Abstract"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
