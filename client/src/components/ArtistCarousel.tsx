import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Artist {
  id: string;
  name: string;
  image: string;
  artworkCount: number;
  specialty: string;
}

const artists: Artist[] = [
  {
    id: "a-1",
    name: "Alex Grey",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    artworkCount: 45,
    specialty: "Visionary Art",
  },
  {
    id: "a-2",
    name: "Luke Brown",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    artworkCount: 32,
    specialty: "Psychedelic Art",
  },
  {
    id: "a-3",
    name: "Hans Haveron",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    artworkCount: 28,
    specialty: "Contemporary",
  },
  {
    id: "a-4",
    name: "Mear One",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
    artworkCount: 24,
    specialty: "Street Art",
  },
  {
    id: "a-5",
    name: "Michael Divine",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop",
    artworkCount: 38,
    specialty: "Visionary Art",
  },
  {
    id: "a-6",
    name: "Mugwort",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    artworkCount: 22,
    specialty: "Digital Art",
  },
  {
    id: "a-7",
    name: "Android Jones",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop",
    artworkCount: 56,
    specialty: "Digital Art",
  },
  {
    id: "a-8",
    name: "Allyson Grey",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    artworkCount: 41,
    specialty: "Visionary Art",
  },
];

export default function ArtistCarousel() {
  const handleFollow = (artistName: string) => {
    toast.success(`Following ${artistName}`, {
      description: "You'll be notified of new artworks",
    });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs tracking-widest uppercase text-purple-400 mb-2 block">
            The Collective
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Artists
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full" />
        </motion.div>

        {/* Artist Cards - Horizontal Scroll */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[280px] snap-center"
              >
                <div className="glass-card rounded-2xl p-6 text-center group hover:glow transition-all duration-300">
                  {/* Avatar */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <h3 className="font-playfair text-xl font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                    {artist.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-2">{artist.specialty}</p>
                  <p className="text-purple-400 text-sm mb-4">
                    {artist.artworkCount} artworks
                  </p>

                  {/* Follow Button */}
                  <Button
                    onClick={() => handleFollow(artist.name)}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-600/20 hover:text-white"
                  >
                    Follow
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
