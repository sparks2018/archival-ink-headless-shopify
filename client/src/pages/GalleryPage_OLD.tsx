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

const categories = [
  "All",
  "Psychedelic",
  "Visionary",
  "Spiritual",
  "Sacred Geometry",
  "Metaphysical",
  "Surrealism",
  "Abstract",
];

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortMode, setSortMode] = useState<SortMode>("browse");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // Load artworks from Shopify
  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        const products = await getProducts(100);
        const transformed = products.map(transformProduct);
        setArtworks(transformed);
        setFilteredArtworks(transformed);
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
    let filtered = [...artworks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (art) =>
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((art) => 
        art.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (art) => art.price >= priceRange[0] && art.price <= priceRange[1]
    );

    // Artist filter
    if (selectedArtists.length > 0) {
      filtered = filtered.filter((art) =>
        selectedArtists.includes(art.artist)
      );
    }

    // Medium filter (would need to add medium field to Artwork type)
    // if (selectedMediums.length > 0) {
    //   filtered = filtered.filter((art) =>
    //     selectedMediums.includes(art.medium)
    //   );
    // }

    // Sort mode
    switch (sortMode) {
      case "trending":
        // Sort by most recent (assuming id order)
        filtered.reverse();
        break;
      case "featured":
        // Sort by highest price (featured = expensive)
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "for-you":
        // Random shuffle for "For You"
        filtered.sort(() => Math.random() - 0.5);
        break;
      default:
        // Browse - default order
        break;
    }

    setFilteredArtworks(filtered);
  }, [
    artworks,
    searchQuery,
    selectedCategory,
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
    setSelectedCategory("All");
    setSortMode("browse");
    setPriceRange([0, 2000]);
    setSelectedArtists([]);
    setSelectedMediums([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 relative z-10 pt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4">
              Discover Your Next <span className="text-purple-400">Obsession</span>
            </h1>
            <p className="text-white/70 text-lg">
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search artworks or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-full text-lg"
              />
            </div>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/50"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Sort Tabs & View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
          >
            {/* Sort Tabs */}
            <div className="flex gap-2 bg-white/5 rounded-full p-1">
              <button
                onClick={() => setSortMode("browse")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  sortMode === "browse"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  Browse
                </span>
              </button>
              <button
                onClick={() => setSortMode("trending")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  sortMode === "trending"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setSortMode("featured")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  sortMode === "featured"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setSortMode("for-you")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  sortMode === "for-you"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                For You
              </button>
            </div>

            {/* View Toggle & Filter Button */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              <div className="flex gap-1 bg-white/5 rounded-full p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full transition-all ${
                    viewMode === "grid"
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full transition-all ${
                    viewMode === "list"
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <AnimatePresence>
              {showFilters && (
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="hidden lg:block w-80 flex-shrink-0"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sticky top-24">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-white font-semibold text-lg">Filters</h3>
                      <button
                        onClick={clearAllFilters}
                        className="text-purple-400 text-sm hover:text-purple-300"
                      >
                        Clear all
                      </button>
                    </div>

                    {/* Price Range */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-white/80 font-medium">Price Range</label>
                        <button className="text-white/60 text-sm">▼</button>
                      </div>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={2000}
                        step={50}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-white/60 text-sm">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <div className="space-y-2 mt-4">
                        <button className="block text-white/60 hover:text-white text-sm">
                          Under $100
                        </button>
                        <button className="block text-white/60 hover:text-white text-sm">
                          $100 - $300
                        </button>
                        <button className="block text-white/60 hover:text-white text-sm">
                          $300 - $500
                        </button>
                        <button className="block text-white/60 hover:text-white text-sm">
                          $500 - $1,000
                        </button>
                        <button className="block text-white/60 hover:text-white text-sm">
                          Over $1,000
                        </button>
                      </div>
                    </div>

                    {/* Artist Filter */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-white/80 font-medium">Artist</label>
                        <button className="text-white/60 text-sm">▼</button>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {artists.map((artist) => (
                          <label
                            key={artist}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <Checkbox
                              checked={selectedArtists.includes(artist)}
                              onCheckedChange={() => handleArtistToggle(artist)}
                              className="border-white/20"
                            />
                            <span className="text-white/70 group-hover:text-white text-sm">
                              {artist}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Medium Filter */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-white/80 font-medium">Medium</label>
                        <button className="text-white/60 text-sm">▼</button>
                      </div>
                      <div className="space-y-3">
                        {mediums.map((medium) => (
                          <label
                            key={medium}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <Checkbox
                              checked={selectedMediums.includes(medium)}
                              onCheckedChange={() => handleMediumToggle(medium)}
                              className="border-white/20"
                            />
                            <span className="text-white/70 group-hover:text-white text-sm">
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

            {/* Gallery Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-white/60">
                  <span className="font-semibold text-white">
                    {filteredArtworks.length}
                  </span>{" "}
                  artworks found
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  <p className="text-white/60 mt-4">Loading artworks...</p>
                </div>
              )}

              {/* Grid View */}
              {!loading && viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* List View */}
              {!loading && viewMode === "list" && (
                <div className="space-y-4">
                  {filteredArtworks.map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex gap-4 hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => setSelectedArtwork(artwork)}
                    >
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {artwork.title}
                        </h3>
                        <p className="text-white/60 mb-2">{artwork.artist}</p>
                        <p className="text-purple-400 font-semibold">
                          ${artwork.price}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredArtworks.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-white/60 text-lg mb-4">
                    No artworks found matching your filters
                  </p>
                  <Button onClick={clearAllFilters} variant="outline">
                    Clear Filters
                  </Button>
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
