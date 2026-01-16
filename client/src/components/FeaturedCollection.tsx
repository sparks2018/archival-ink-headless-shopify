import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function FeaturedCollection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/featured-collection.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-xs tracking-widest uppercase bg-green-600/30 backdrop-blur-sm text-green-300 rounded-full border border-green-500/30">
              Featured Collection
            </span>
            
            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Sacred Consumption
            </h2>
            
            <p className="text-xl text-white/80 mb-6 leading-relaxed">
              A Plant Medicine Celebration - Explore visionary artwork celebrating the sacred relationship between humanity and plant medicines.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="glass-card px-4 py-2 rounded-lg">
                <span className="text-white/60 text-sm">Artworks</span>
                <p className="text-white font-semibold">24+</p>
              </div>
              <div className="glass-card px-4 py-2 rounded-lg">
                <span className="text-white/60 text-sm">Artists</span>
                <p className="text-white font-semibold">12</p>
              </div>
              <div className="glass-card px-4 py-2 rounded-lg">
                <span className="text-white/60 text-sm">Starting at</span>
                <p className="text-white font-semibold">$50</p>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              onClick={() => toast("Collection page coming soon")}
            >
              Explore Collection
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
