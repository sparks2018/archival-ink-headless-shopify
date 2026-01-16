import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid, List, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";
import Lightbox from "@/components/Lightbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { getProducts } from "@/lib/shopify";
import { transformProduct } from "@/lib/shopify-transform";
import {
  PRODUCT_TYPE_CATEGORIES,
  THEMATIC_CATEGORIES,
  filterArtworks,
  getCategoryCounts,
  getProductTypeCounts,
} from "@/lib/categorization";
import type { Artwork } from "@/hooks/useShopifyProducts";

const artists = [
  "Alex Grey",
  "Luke Brown",
  "Hans Haveron",
  "Joseph Santori",
  "John Park",
  "Mear One",
  "Mars-1",
  "Michael Divine",
  "Android Jones",
  "Chris Dyer",
];

const mediums = [
  "Fine Art Print",
  "Canvas Print",
  "Original Painting",
  "Digital Print",
  "Limited Edition",
  "Giclee Print",
];

type ViewMode = "grid" | "list";
type SortMode = "browse" | "trending" | "featured" | "for-you";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductType, setSelectedProductType] = useState(""); // Empty = "All"
  const [selectedThematicCategory, setSelectedThematicCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("browse");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // Category counts
  const [thematicCounts, setThematicCounts] = useState<Record<string, number>>({});
  const [productTypeCounts, setProductTypeCounts] = useState<Record<string, number>>({});

  // Load artworks from Shopify
  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        const products = await getProducts(100);
        const transformed = products.map(transformProduct);
        setArtworks(transformed);
        setFilteredArtworks(transformed);
        
        // Calculate category counts
        setThematicCounts(getCategoryCounts(transformed));
        setProductTypeCounts(getProductTypeCounts(transformed));
      } catch (error) {
        console.error("Error loading artworks:", error);
      } finally {
        setLoading(false);
      }
    }
    loadArtworks();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = filterArtworks(
      artworks,
      selectedProductType,
      selectedThematicCategory,
      searchQuery,
      priceRange as [number, number],
      selectedArtists.length > 0 ? selectedArtists : undefined,
      selectedMediums.length > 0 ? selectedMediums : undefined
    );

    // Sort mode
    switch (sortMode) {
      case "trending":
        // Sort by most recent (assuming reverse order)
        filtered = [...filtered].reverse();
        break;
      case "featured":
        // Sort by highest price (featured = expensive)
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "for-you":
        // Random shuffle for "For You"
        filtered = [...filtered].sort(() => Math.random() - 0.5);
        break;
      default:
        // Browse - default order
        break;
    }

    setFilteredArtworks(filtered);
  }, [
    artworks,
    searchQuery,
    selectedProductType,
    selectedThematicCategory,
    sortMode,
    priceRange,
    selectedArtists,
    selectedMediums,
  ]);

  const handleArtistToggle = (artist: string) => {
    setSelectedArtists((prev) =>
      prev.includes(artist)
        ? prev.filter((a) => a !== artist)
        : [...prev, artist]
    );
  };

  const handleMediumToggle = (medium: string) => {
    setSelectedMediums((prev) =>
      prev.includes(medium)
        ? prev.filter((m) => m !== medium)
        : [...prev, medium]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedProductType("");
    setSelectedThematicCategory("all");
    setSortMode("browse");
    setPriceRange([0, 2000]);
    setSelectedArtists([]);
    setSelectedMediums([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 relative z-10 pt-24 bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Discover Your Next <span className="text-gradient">Obsession</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Browse curated artworks from visionary artists worldwide
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search artworks or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500"
              />
            </div>
          </motion.div>

          {/* Product Type Categories (Primary Filter) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-600 text-sm font-medium">Format:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {PRODUCT_TYPE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedProductType(category.value)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedProductType === category.value
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {category.label}
                  {productTypeCounts[category.id] !== undefined && (
                    <span className="ml-2 text-xs opacity-60">
                      ({productTypeCounts[category.id]})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Thematic Categories (Secondary Filter) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-600 text-sm font-medium">Theme:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {THEMATIC_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedThematicCategory(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedThematicCategory === category.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {category.label}
                  {thematicCounts[category.id] !== undefined && (
                    <span className="ml-2 text-xs opacity-60">
                      ({thematicCounts[category.id]})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Sort Tabs & View Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex gap-2">
              <button
                onClick={() => setSortMode("browse")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  sortMode === "browse"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Grid className="w-4 h-4" />
                Browse
              </button>
              <button
                onClick={() => setSortMode("trending")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  sortMode === "trending"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setSortMode("featured")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  sortMode === "featured"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setSortMode("for-you")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  sortMode === "for-you"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                For You
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <AnimatePresence>
              {showFilters && (
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-64 flex-shrink-0"
                >
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-gray-900 font-semibold">Filters</h3>
                      <button
                        onClick={clearAllFilters}
                        className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                      <button
                        className="flex items-center justify-between w-full mb-4 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <span className="font-medium">Price Range</span>
                        <span className="text-sm">▼</span>
                      </button>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={2000}
                        step={50}
                        className="mb-4"
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button
                          onClick={() => setPriceRange([0, 100])}
                          className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-xs transition-all"
                        >
                          Under $100
                        </button>
                        <button
                          onClick={() => setPriceRange([100, 300])}
                          className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-xs transition-all"
                        >
                          $100 - $300
                        </button>
                        <button
                          onClick={() => setPriceRange([300, 500])}
                          className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-xs transition-all"
                        >
                          $300 - $500
                        </button>
                        <button
                          onClick={() => setPriceRange([500, 1000])}
                          className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-xs transition-all"
                        >
                          $500 - $1,000
                        </button>
                        <button
                          onClick={() => setPriceRange([1000, 2000])}
                          className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-xs col-span-2 transition-all"
                        >
                          Over $1,000
                        </button>
                      </div>
                    </div>

                    {/* Artist Filter */}
                    <div className="mb-6">
                      <button
                        className="flex items-center justify-between w-full mb-4 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <span className="font-medium">Artist</span>
                        <span className="text-sm">▼</span>
                      </button>
                      <div className="space-y-3">
                        {artists.map((artist) => (
                          <label
                            key={artist}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <Checkbox
                              checked={selectedArtists.includes(artist)}
                              onCheckedChange={() => handleArtistToggle(artist)}
                              className="border-gray-300"
                            />
                            <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm">
                              {artist}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Medium Filter */}
                    <div>
                      <button
                        className="flex items-center justify-between w-full mb-4 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <span className="font-medium">Medium</span>
                        <span className="text-sm">▼</span>
                      </button>
                      <div className="space-y-3">
                        {mediums.map((medium) => (
                          <label
                            key={medium}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <Checkbox
                              checked={selectedMediums.includes(medium)}
                              onCheckedChange={() => handleMediumToggle(medium)}
                              className="border-gray-300"
                            />
                            <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm">
                              {medium}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Artwork Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-gray-600">
                  <span className="text-gray-900 font-semibold"
                    {filteredArtworks.length}
                  </span>{" "}
                  artworks found
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : filteredArtworks.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg mb-4">
                    No artworks found matching your filters
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {filteredArtworks.map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ArtworkCard
                        artwork={artwork}
                        onClick={() => setSelectedArtwork(artwork)}
                        aspectRatio="portrait"
                        theme="light"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedArtwork && (
          <Lightbox
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
            allArtworks={filteredArtworks}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
