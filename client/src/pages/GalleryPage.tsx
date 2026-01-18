import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid, List, SlidersHorizontal, X } from "lucide-react";
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
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  
  // Desktop: sidebar visible, Mobile: sidebar hidden
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilterOverlay, setShowMobileFilterOverlay] = useState(false);

  // Category counts
  const [thematicCounts, setThematicCounts] = useState<Record<string, number>>({});
  const [productTypeCounts, setProductTypeCounts] = useState<Record<string, number>>({});

  // Detect if desktop (show sidebar by default on desktop)
  useEffect(() => {
    const checkIfDesktop = () => {
      setShowFilters(window.innerWidth >= 750); // Custom 750px breakpoint
    };
    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  // Load artworks from Shopify
  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        const products = await getProducts(250); // Fetch up to 250 products (Shopify max)
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
    setPriceRange([0, 100000]);
    setSelectedArtists([]);
    setSelectedMediums([]);
  };

  const handleShowResults = () => {
    setShowMobileFilterOverlay(false);
  };

  // Filter sidebar content (reusable for desktop sidebar and mobile overlay)
  const FilterContent = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
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
          max={100000}
          step={1000}
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
            onClick={() => setPriceRange([1000, 100000])}
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
  );

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
            className="mb-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-700 text-xs font-semibold">Format:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TYPE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedProductType(category.value)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${
                    selectedProductType === category.value
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                  {productTypeCounts[category.id] !== undefined && (
                    <span className="ml-1.5 text-xs opacity-70">
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
            className="mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-700 text-xs font-semibold">Theme:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {THEMATIC_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedThematicCategory(category.id)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${
                    selectedThematicCategory === category.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                  {thematicCounts[category.id] !== undefined && (
                    <span className="ml-1.5 text-xs opacity-70">
                      ({thematicCounts[category.id]})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Mobile Filter Button Row + Desktop Sort Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            {/* Universal Filter Button Row (All Screen Sizes) */}
            <div className="flex items-center justify-between gap-3 mb-4">
              {/* Purple Hamburger/X Button + All Filters Label */}
              <button
                onClick={() => {
                  if (window.innerWidth < 750) {
                    setShowMobileFilterOverlay(true);
                  } else {
                    setShowFilters(true);
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:border-purple-500 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <SlidersHorizontal className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">All Filters</span>
              </button>

              {/* Sort Dropdown (Mobile) */}
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:border-purple-500 transition-all md:hidden"
              >
                <option value="browse">Sort: Best Match</option>
                <option value="trending">Sort: Trending</option>
                <option value="featured">Sort: Featured</option>
                <option value="for-you">Sort: For You</option>
              </select>
            </div>

            {/* Desktop: Sort Tabs & View Controls */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setSortMode("browse")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-all ${
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
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    sortMode === "trending"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Trending
                </button>
                <button
                  onClick={() => setSortMode("featured")}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    sortMode === "featured"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => setSortMode("for-you")}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    sortMode === "for-you"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  For You
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Desktop: Toggle sidebar button */}
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
            </div>
          </motion.div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hidden lg:block w-full max-w-[236px] flex-shrink-0"
                  >
                    <div className="sticky top-24">
                      <FilterContent />
                    </div>
                  </motion.aside>
                  
                  {/* Floating X Button for Desktop Sidebar */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setShowFilters(false)}
                    className="hidden lg:block fixed top-24 left-[220px] z-50 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Artwork Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-gray-600">
                  <span className="text-gray-900 font-semibold">
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
                      ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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

      {/* Mobile Filter Sidebar (Slide-in from Left - eBay Style) */}
      <AnimatePresence>
        {showMobileFilterOverlay && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilterOverlay(false)}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            />
            
            {/* Slide-in Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[50%] max-w-xs bg-white lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between z-10">
                <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
              </div>
              
              <div className="p-3 text-sm">
                <FilterContent />
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3">
                <button
                  onClick={handleShowResults}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-base hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Show {filteredArtworks.length} Results
                </button>
              </div>
            </motion.div>

            {/* Floating X Button (Top Right of Sidebar - Mobile) */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowMobileFilterOverlay(false)}
              className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              style={{ left: "calc(50% - 48px)" }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

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
