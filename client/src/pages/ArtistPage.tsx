import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import BackToTop from "@/components/BackToTop";
import StarField from "@/components/StarField";
import ArtworkCardWhite from "@/components/ArtworkCardWhite";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useShopifyProducts, useShopifyCollections } from "@/hooks/useShopifyProducts";
import type { Artwork } from "@/lib/shopify-transform";

// Artist bios (static data)
const artistBios: Record<string, { name: string; bio: string; bannerImage: string }> = {
  "alex-grey": {
    name: "Alex Grey",
    bio: "Alex Grey is an American visionary artist, author, teacher, and Vajrayana practitioner. His body of work spans a variety of forms including performance art, process art, installation art, sculpture, visionary art, and painting. Grey is a member of the Integral Institute. He is also on the board of advisors for the Center for Cognitive Liberty and Ethics, and is the Chair of Wisdom University's Sacred Art Department. He and his wife Allyson Grey are the co-founders of The Chapel of Sacred Mirrors (CoSM), a non-profit church supporting Visionary Culture in Wappingers Falls, New York. They both focus primarily on creating psychedelic art.",
    bannerImage: "/images/hero-visionary-2.jpg",
  },
  "allyson-grey": {
    name: "Allyson Grey",
    bio: "Allyson Grey is an American visual artist best known for her paintings and drawings exploring the realms of Chaos, Order and Secret Writing. She is the co-founder of The Chapel of Sacred Mirrors (CoSM) with her husband Alex Grey. Her work has been exhibited internationally and is collected by museums and private collectors worldwide. Allyson's art explores the interconnectedness of all things through sacred geometry and symbolic language.",
    bannerImage: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=1200&h=600&fit=crop",
  },
  "android-jones": {
    name: "Android Jones",
    bio: "Android Jones is a digital artist known for his vibrant, psychedelic digital paintings that blend technology with spirituality. His work has been featured at major festivals including Burning Man and has collaborated with musicians like Tipper and Beats Antique. Jones creates immersive visual experiences that push the boundaries of digital art and consciousness exploration.",
    bannerImage: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=600&fit=crop",
  },
  "luke-brown": {
    name: "Luke Brown",
    bio: "Luke Brown (Spectraleyes) is a visionary artist whose intricate, psychedelic paintings explore themes of consciousness, sacred geometry, and the interconnectedness of all life. His detailed works feature complex patterns, mythological imagery, and vibrant colors that invite viewers into transcendent realms. Brown's art has been exhibited internationally and is highly sought after by collectors of visionary art.",
    bannerImage: "/images/hero-visionary-1.jpg",
  },
  "michael-divine": {
    name: "Michael Divine",
    bio: "Michael Divine is a contemporary visionary artist whose luminous paintings explore themes of nature, consciousness, and the divine. His work is characterized by flowing organic forms, radiant light, and a deep reverence for the natural world. Divine's paintings have been exhibited in galleries worldwide and are collected by those seeking art that inspires spiritual contemplation.",
    bannerImage: "/images/hero-visionary-3.jpg",
  },
  "hans-haveron": {
    name: "Hans Haveron",
    bio: "Hans Haveron is a contemporary artist known for his surrealist cityscapes and architectural dreamscapes. His detailed graphite and ink drawings explore the intersection of urban environments and the subconscious mind, creating impossible structures that challenge perception and invite contemplation.",
    bannerImage: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=1200&h=600&fit=crop",
  },
  "mear-one": {
    name: "Mear One",
    bio: "Mear One (Kalen Ockerman) is a Los Angeles-based muralist and fine artist whose work addresses social, political, and spiritual themes. His large-scale murals can be found on walls around the world, combining classical techniques with contemporary street art aesthetics to create powerful visual narratives.",
    bannerImage: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=1200&h=600&fit=crop",
  },
};

export default function ArtistPage() {
  const params = useParams();
  const artistSlug = params.slug || "";
  const [location, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState("default");
  const [selectedLightboxArtwork, setSelectedLightboxArtwork] = useState<Artwork | null>(null);

  // Fetch all products from Shopify
  const { artworks: allArtworks, isLoading, error } = useShopifyProducts();
  const { artists } = useShopifyCollections();

  // Get artist info from bio data or collections
  const artistInfo = useMemo(() => {
    // First try to get from static bios
    if (artistBios[artistSlug]) {
      return artistBios[artistSlug];
    }
    
    // Otherwise try to find in Shopify collections
    const collection = artists.find(a => a.slug === artistSlug);
    if (collection) {
      return {
        name: collection.name,
        bio: collection.bio || "Explore the works of this talented artist.",
        bannerImage: collection.image || "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=600&fit=crop",
      };
    }

    // Fallback
    return {
      name: artistSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      bio: "Explore the works of this talented artist.",
      bannerImage: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=600&fit=crop",
    };
  }, [artistSlug, artists]);

  // Filter artworks by artist
  const artistArtworks = useMemo(() => {
    if (!allArtworks || allArtworks.length === 0) return [];
    
    // Normalize artist name for comparison
    const normalizeArtistName = (name: string) => {
      return name.toLowerCase().replace(/[^a-z0-9]/g, '');
    };
    
    const targetArtist = normalizeArtistName(artistInfo.name);
    
    return allArtworks
      .filter(artwork => artwork != null && artwork.id != null && artwork.artist != null) // Filter out null/undefined
      .filter(artwork => {
        const artworkArtist = normalizeArtistName(artwork.artist);
        return artworkArtist === targetArtist || artworkArtist.includes(targetArtist);
      });
  }, [allArtworks, artistInfo.name]);

  // Sort artworks
  const sortedArtworks = useMemo(() => {
    // Filter out null/undefined artworks before sorting
    const artworks = [...artistArtworks].filter(artwork => artwork != null && artwork.id != null);
    
    switch (sortBy) {
      case "price-low":
        return artworks.sort((a, b) => a.price - b.price);
      case "price-high":
        return artworks.sort((a, b) => b.price - a.price);
      case "title":
        return artworks.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return artworks;
    }
  }, [artistArtworks, sortBy]);

  // Handle lightbox from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const artworkSlug = params.get("artwork");
    
    if (artworkSlug && sortedArtworks.length > 0) {
      const artwork = sortedArtworks.find(
        (a) => a.handle === artworkSlug || a.title.toLowerCase().replace(/\s+/g, "-") === artworkSlug
      );
      if (artwork) {
        setSelectedLightboxArtwork(artwork);
      }
    } else {
      setSelectedLightboxArtwork(null);
    }
  }, [location, sortedArtworks]);

  const openLightbox = (artwork: Artwork) => {
    setSelectedLightboxArtwork(artwork);
    const slug = artwork.handle || artwork.title.toLowerCase().replace(/\s+/g, "-");
    setLocation(`${location.split("?")[0]}?artwork=${slug}`);
  };

  const closeLightbox = () => {
    setSelectedLightboxArtwork(null);
    setLocation(location.split("?")[0]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <StarField />
        <Header />
        <div className="container pt-32 pb-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-white/60">Loading artist...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <StarField />
        <Header />
        <div className="container pt-32 pb-20">
          <div className="text-center">
            <p className="text-red-500">Error loading artist: {error.message}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <StarField />
      <Header />

      {/* Artist Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${artistInfo.bannerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-dark" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-purple-400 uppercase tracking-widest text-sm mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Featured Artist</p>
            <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-8" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
              {artistInfo.name}
            </h1>
            <p className="text-white/90 text-lg leading-relaxed" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              {artistInfo.bio}
            </p>
          </motion.div>
        </div>
      </section>

      {/* White Background Section */}
      <div className="bg-white">
        {/* Breadcrumb */}
        <div className="container py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">{artistInfo.name}</span>
          </div>
        </div>

        {/* Artworks Grid */}
        <section className="container pb-20">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Artworks</h2>
            <p className="text-gray-600 text-sm mt-1">
              {sortedArtworks.length} {sortedArtworks.length === 1 ? "artwork" : "artworks"} available
            </p>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] bg-white border-gray-300">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="title">Title: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {sortedArtworks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No artworks found for this artist.</p>
            <Link href="/">
              <Button className="mt-6">
                Back to Gallery
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedArtworks.filter(artwork => artwork && artwork.id).map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
              >
                <ArtworkCardWhite 
                  artwork={artwork} 
                  onClick={() => openLightbox(artwork)}
                  aspectRatio="portrait"
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedLightboxArtwork && (
          <Lightbox artwork={selectedLightboxArtwork} onClose={closeLightbox} />
        )}
      </AnimatePresence>

      <BackToTop />
      <Footer />
    </div>
  );
}
