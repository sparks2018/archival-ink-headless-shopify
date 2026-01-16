import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import StarField from "@/components/StarField";
import AllArtists from "@/components/AllArtists";

export default function AllArtistsPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <StarField />
      <Header />
      
      <div className="pt-20">
        <AllArtists />
      </div>

      <BackToTop />
      <Footer />
    </div>
  );
}
