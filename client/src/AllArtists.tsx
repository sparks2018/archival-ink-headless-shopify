import { motion } from "framer-motion";
import { Link } from "wouter";
import { useShopifyCollections } from "@/hooks/useShopifyProducts";

export default function AllArtists() {
  const { artists, isLoading, error } = useShopifyCollections();

  if (isLoading) {
    return (
      <section id="artists" className="py-20 bg-dark/50">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 mb-4 text-xs tracking-widest uppercase bg-purple-600/30 backdrop-blur-sm text-purple-300 rounded-full border border-purple-500/30">
                All Artists
              </span>
              <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4">
                The Collective
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Loading artists...
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="artists" className="py-20 bg-dark/50">
        <div className="container">
          <div className="text-center">
            <p className="text-red-500">Error loading artists: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="artists" className="py-20 bg-dark/50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-xs tracking-widest uppercase bg-purple-600/30 backdrop-blur-sm text-purple-300 rounded-full border border-purple-500/30">
              All Artists
            </span>
            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4">
              The Collective
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Explore works from our curated collection of visionary and contemporary artists
            </p>
          </motion.div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/artist/${artist.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">
                        {artist.artworkCount || 0} {artist.artworkCount === 1 ? 'work' : 'works'}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm uppercase tracking-wider group-hover:text-purple-400 transition-colors">
                    {artist.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
