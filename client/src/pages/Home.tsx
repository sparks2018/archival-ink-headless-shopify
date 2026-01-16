import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedArtist from "@/components/FeaturedArtist";
import StatsBar from "@/components/StatsBar";
import ArtworkRow from "@/components/ArtworkRow";
import AllArtists from "@/components/AllArtists";
import Lightbox from "@/components/Lightbox";
import ShootingStars from "@/components/ShootingStars";
import Newsletter from "@/components/Newsletter";
import BackToTop from "@/components/BackToTop";
import StarField from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { getProducts, getCollectionByHandle } from "@/lib/shopify";
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

export default function Home() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showShootingStars, setShowShootingStars] = useState(false);
  const [location, setLocation] = useLocation();
  
  // Artwork collections for different rows
  const [trendingArtworks, setTrendingArtworks] = useState<Artwork[]>([]);
  const [highestValueArtworks, setHighestValueArtworks] = useState<Artwork[]>([]);
  const [mostLikedArtworks, setMostLikedArtworks] = useState<Artwork[]>([]);
  const [alexGreyArtworks, setAlexGreyArtworks] = useState<Artwork[]>([]);
  const [lukeBrownArtworks, setLukeBrownArtworks] = useState<Artwork[]>([]);
  const [hansHaveronArtworks, setHansHaveronArtworks] = useState<Artwork[]>([]);
  const [johnParkArtworks, setJohnParkArtworks] = useState<Artwork[]>([]);
  const [mearOneArtworks, setMearOneArtworks] = useState<Artwork[]>([]);
  const [michaelDivineArtworks, setMichaelDivineArtworks] = useState<Artwork[]>([]);
  const [androidJonesArtworks, setAndroidJonesArtworks] = useState<Artwork[]>([]);
  const [chrisDyerArtworks, setChrisDyerArtworks] = useState<Artwork[]>([]);
  const [mars1Artworks, setMars1Artworks] = useState<Artwork[]>([]);
  const [vanSaroArtworks, setVanSaroArtworks] = useState<Artwork[]>([]);

  const handleCarouselChange = useCallback(() => {
    setShowShootingStars(true);
    setTimeout(() => setShowShootingStars(false), 1500);
  }, []);

  const handleViewDetail = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    // Create URL-friendly slug from artwork title
    const slug = artwork.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // Update URL with query parameter
    const newUrl = `${location.split('?')[0]}?artwork=${slug}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleCloseLightbox = () => {
    setSelectedArtwork(null);
    // Remove query parameter from URL
    const newUrl = location.split('?')[0];
    window.history.pushState({}, '', newUrl);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const artworkParam = params.get('artwork');
      if (!artworkParam && selectedArtwork) {
        setSelectedArtwork(null);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedArtwork]);

  // Load artworks from Shopify API
  useEffect(() => {
    async function loadArtworks() {
      try {
        // Get all products
        const products = await getProducts(100);
        const allArtworks = products.map(transformProduct);

        // Sort by price (highest first) for "Highest Value"
        const sortedByPrice = [...allArtworks].sort((a, b) => b.price - a.price);
        setHighestValueArtworks(sortedByPrice.slice(0, 12));

        // Reverse for "Trending" (newest first, assuming newer products have higher IDs)
        const trending = [...allArtworks].reverse().slice(0, 12);
        setTrendingArtworks(trending);

        // For "Most Liked", use featured or highest priced as proxy
        const mostLiked = [...sortedByPrice].slice(0, 12);
        setMostLikedArtworks(mostLiked);

        // Filter by artist for artist-specific rows (most expensive first)
        const filterByArtist = (artistName: string) => {
          return allArtworks
            .filter((art) => 
              art.artist.toLowerCase().includes(artistName.toLowerCase())
            )
            .sort((a, b) => b.price - a.price) // Sort by price descending
            .slice(0, 12);
        };

        setAlexGreyArtworks(filterByArtist("alex grey"));
        setLukeBrownArtworks(filterByArtist("luke brown"));
        setHansHaveronArtworks(filterByArtist("hans haveron"));
        setJohnParkArtworks(filterByArtist("john park"));
        setMearOneArtworks(filterByArtist("mear one"));
        setMichaelDivineArtworks(filterByArtist("michael divine"));
        setAndroidJonesArtworks(filterByArtist("android jones"));
        setChrisDyerArtworks(filterByArtist("chris dyer"));
        setMars1Artworks(filterByArtist("mars-1"));
        setVanSaroArtworks(filterByArtist("van saro"));

      } catch (error) {
        console.error("Error loading artworks:", error);
      }
    }
    loadArtworks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
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
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Animated Star Field */}
      <StarField />

      {/* Shooting Stars Animation */}
      <AnimatePresence>
        {showShootingStars && <ShootingStars />}
      </AnimatePresence>

      <Header />

      <main className="flex-1 relative z-10">
        {/* Hero Carousel Section */}
        <HeroCarousel onSlideChange={handleCarouselChange} />

        {/* Stats Bar */}
        <StatsBar />

        {/* White Background Wrapper - Everything after hero */}
        <div className="bg-white relative z-10">

        {/* Featured Artist Section - Alex Grey */}
        <FeaturedArtist onViewDetail={handleViewDetail} />

        {/* View Alex Grey Collection Button */}
        <div className="container mx-auto px-4 py-8 text-center">
          <Link href="/artist/alex-grey">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-12 py-6 text-lg rounded-full shadow-lg shadow-purple-600/50 hover:shadow-xl hover:shadow-purple-600/60 transition-all"
            >
              View Alex Grey Collection
            </Button>
          </Link>
        </div>

        {/* Netflix-Style Artwork Rows */}
        
        {/* Trending Row */}
        {trendingArtworks.length > 0 && (
          <ArtworkRow
            title="Trending"
            subtitle="Latest additions to our collection"
            artworks={trendingArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {/* Highest Value Row */}
        {highestValueArtworks.length > 0 && (
          <ArtworkRow
            title="Highest Value"
            subtitle="Premium pieces from our collection"
            artworks={highestValueArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {/* Most Liked Row */}
        {mostLikedArtworks.length > 0 && (
          <ArtworkRow
            title="Most Popular"
            subtitle="Fan favorites and bestsellers"
            artworks={mostLikedArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {/* Artist-Specific Rows */}
        {lukeBrownArtworks.length > 0 && (
          <ArtworkRow
            title="Luke Brown"
            subtitle="Visionary artist and psychedelic pioneer"
            artworks={lukeBrownArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {hansHaveronArtworks.length > 0 && (
          <ArtworkRow
            title="Hans Haveron"
            subtitle="Contemporary visionary art"
            artworks={hansHaveronArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {johnParkArtworks.length > 0 && (
          <ArtworkRow
            title="John Park"
            subtitle="Classical meets contemporary"
            artworks={johnParkArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {mearOneArtworks.length > 0 && (
          <ArtworkRow
            title="Mear One"
            subtitle="Street art and urban culture"
            artworks={mearOneArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {michaelDivineArtworks.length > 0 && (
          <ArtworkRow
            title="Michael Divine"
            subtitle="Sacred geometry and spiritual art"
            artworks={michaelDivineArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {androidJonesArtworks.length > 0 && (
          <ArtworkRow
            title="Android Jones"
            subtitle="Digital visionary art"
            artworks={androidJonesArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {chrisDyerArtworks.length > 0 && (
          <ArtworkRow
            title="Chris Dyer"
            subtitle="Positive creations and vibrant energy"
            artworks={chrisDyerArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {mars1Artworks.length > 0 && (
          <ArtworkRow
            title="Mars-1"
            subtitle="Surrealism and cosmic landscapes"
            artworks={mars1Artworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {vanSaroArtworks.length > 0 && (
          <ArtworkRow
            title="Van Saro"
            subtitle="Modern visionary expressions"
            artworks={vanSaroArtworks}
            onViewDetail={handleViewDetail}
          />
        )}

        {/* Browse All Art Button */}
        <div className="container mx-auto px-4 py-12 text-center">
          <Link href="/gallery">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold px-12 py-6 text-lg rounded-full transition-all"
            >
              Browse All Art
            </Button>
          </Link>
        </div>

        {/* All Artists Section */}
        <div id="artists">
          <AllArtists />
        </div>

        {/* Three Info Cards Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Flat Rate Shipping */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-4">
                  FLAT RATE SHIPPING
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Your artwork is safely and securely packaged & shipped (Within the U.S. only) for $8.95
                </p>
              </motion.div>

              {/* Certificates of Authenticity */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-4">
                  CERTIFICATES OF AUTHENTICITY
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We are an authorized reseller for all of our artist. You will receive signed certificates of authenticity for any print purchased. Through our website.
                </p>
              </motion.div>

              {/* Need Assistance */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-4">
                  NEED ASSISTANCE?
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Got a question about art or a framing style? Contact us anytime and we will gladly do our best to assist you.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Artist Submission Form Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-3xl p-12 text-center"
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
                ARTIST SUBMISSION FORM
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-3xl mx-auto">
                "Are you an artist that would like your work represented at Fine Art Direct Online? Click here to submit a sample of your work."
              </p>
              <Link href="/submit-art">
                <Button
                  size="lg"
                  className="bg-white text-purple-900 hover:bg-white/90 font-semibold px-12 py-6 text-lg rounded-full shadow-lg transition-all"
                >
                  Submit Your Art
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
        </div>
        {/* End White Background Wrapper */}
      </main>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedArtwork && (
          <Lightbox artwork={selectedArtwork} onClose={handleCloseLightbox} />
        )}
      </AnimatePresence>

      {/* Back to Top */}
      <BackToTop />
    </div>
  );
}
