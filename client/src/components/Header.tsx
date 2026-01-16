import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Search, Menu, X, User, ChevronDown, MessageCircle } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import SearchModal from "@/components/SearchModal";
import CartSidebar from "@/components/CartSidebar";

const navItems = [
  { name: "Home", href: "/", isLink: true },
  { name: "The Artists", href: "/artists", hasDropdown: true, isLink: true },
  { name: "Gallery", href: "/gallery", isLink: true },
  { name: "Contact", href: "/contact", isLink: true },
  { name: "Submit Art", href: "/submit-art", isLink: true },
];

const artists = [
  { name: "All Collections", slug: "all" },
  { name: "Alex Grey", slug: "alex-grey" },
  { name: "Allyson Grey", slug: "allyson-grey" },
  { name: "Android Jones", slug: "android-jones" },
  { name: "Blue Logan", slug: "blue-logan" },
  { name: "Christopher Pugliese", slug: "christopher-pugliese" },
  { name: "Chris Dyer", slug: "chris-dyer" },
  { name: "Chris Saunders", slug: "chris-saunders" },
  { name: "David Lawell", slug: "david-lawell" },
  { name: "Hans Haveron", slug: "hans-haveron" },
  { name: "Jake Kobrin", slug: "jake-kobrin" },
  { name: "John Park", slug: "john-park" },
  { name: "Joseph Santori", slug: "joseph-santori" },
  { name: "Luke Brown", slug: "luke-brown" },
  { name: "Mars-1", slug: "mars-1" },
  { name: "Mear One", slug: "mear-one" },
  { name: "Michael Divine", slug: "michael-divine" },
  { name: "Michael Pukac", slug: "michael-pukac" },
  { name: "Mimi Yoon", slug: "mimi-yoon" },
  { name: "Mugwort", slug: "mugwort" },
  { name: "Rachel Mandala", slug: "rachel-mandala" },
  { name: "Radhika Hersey", slug: "radhika-hersey" },
  { name: "Samuel Farrand", slug: "samuel-farrand" },
  { name: "Sequoia Emmanuelle", slug: "sequoia-emmanuelle" },
  { name: "Stella Strzyzowska", slug: "stella-strzyzowska" },
  { name: "Van Saro", slug: "van-saro" },
  { name: "Yurik Riegel", slug: "yurik-riegel" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showArtistsDropdown, setShowArtistsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useLocation();
  const { favoritesCount } = useFavorites();
  const { cartCount, setOnCartOpen } = useCart();

  // Register callback to open cart when item is added
  useEffect(() => {
    setOnCartOpen(() => {
      setShowCart(true);
    });
  }, [setOnCartOpen]);

  const handleArtworkClick = (artwork: any) => {
    // Navigate to home with artwork ID to open lightbox
    setLocation(`/?artwork=${artwork.id}`);
  };

  const smoothScrollTo = (elementId: string) => {
    // If we're not on the homepage, navigate there first
    if (location !== "/") {
      setLocation("/");
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsMenuOpen(false);
  };

  const handleNavClick = (href: string, isScrollLink?: boolean, isLink?: boolean) => {
    if (isScrollLink && href.startsWith("#")) {
      smoothScrollTo(href.substring(1));
      return;
    }
    if (isLink) {
      setLocation(href);
      setIsMenuOpen(false);
      return;
    }
    if (href.startsWith("#")) {
      toast("Feature coming soon", {
        description: "This section is under development",
      });
    }
    setIsMenuOpen(false);
  };

  const handleArtistClick = (slug: string) => {
    if (slug === "all") {
      setLocation("/artists");
    } else {
      setLocation(`/artist/${slug}`);
    }
  };

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-white/10">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-playfair text-2xl md:text-3xl font-bold text-white tracking-wide">
                  Archival<span className="text-purple-400">Ink</span>
                </span>
                <span className="font-playfair text-sm md:text-base text-white/80 ml-2 tracking-widest uppercase">
                  Gallery
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.hasDropdown ? (
                  <div key={item.name} className="relative" ref={dropdownRef}>
                    <Button
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10 text-xs tracking-widest uppercase font-medium"
                      onMouseEnter={() => setShowArtistsDropdown(true)}
                      onMouseLeave={() => setShowArtistsDropdown(false)}
                      onClick={() => setLocation("/artists")}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                    {showArtistsDropdown && (
                      <div 
                        className="absolute top-full left-0 mt-0 bg-gray-900/95 backdrop-blur-md border border-white/10 min-w-[200px] max-h-[70vh] overflow-y-auto rounded-lg shadow-xl z-50"
                        onMouseEnter={() => setShowArtistsDropdown(true)}
                        onMouseLeave={() => setShowArtistsDropdown(false)}
                      >
                        {artists.map((artist) => (
                          <button
                            key={artist.slug}
                            className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer text-xs tracking-widest uppercase"
                            onClick={() => {
                              handleArtistClick(artist.slug);
                              setShowArtistsDropdown(false);
                            }}
                          >
                            {artist.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10 text-xs tracking-widest uppercase font-medium"
                    onClick={() => handleNavClick(item.href, item.isScrollLink, item.isLink)}
                  >
                    {item.name}
                  </Button>
                )
              )}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setShowSearch(true)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Messages */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/10 relative hidden sm:flex"
                onClick={() => window.location.href = "/messages"}
              >
                <MessageCircle className="w-5 h-5" />
                {/* Badge for unread messages */}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                >
                  3
                </motion.span>
              </Button>

              {/* User */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/10 hidden sm:flex"
                onClick={() => window.location.href = "/profile"}
              >
                <User className="w-5 h-5" />
              </Button>

              {/* Favorites */}
              <Link href="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/10 relative"
                  onClick={() => {
                    // Scroll to top when clicking favorites
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                  }}
                >
                  <Heart className={`w-5 h-5 ${favoritesCount > 0 ? "text-red-500 fill-red-500" : ""}`} />
                  {favoritesCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                    >
                      {favoritesCount}
                    </motion.span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/10 relative"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-t border-white/5">
          <div className="container py-2 text-center">
            <span className="text-white/80 text-sm">
              👋 Free shipping on orders over $100.00
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-b border-white/10"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 justify-start text-sm tracking-widest uppercase"
                  onClick={() => handleNavClick(item.href, item.isScrollLink, item.isLink)}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* Search Modal */}
    <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} onArtworkClick={handleArtworkClick} />

    {/* Cart Sidebar */}
    <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
