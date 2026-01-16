// Removed framer-motion to fix React error #185
import { Link } from "wouter";

interface ArtistCollection {
  id: string;
  name: string;
  slug: string;
  image: string;
  artworkCount: number;
}

const artistCollections: ArtistCollection[] = [
  {
    id: "3d-art",
    name: "3D Art",
    slug: "3d-art",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop",
    artworkCount: 12,
  },
  {
    id: "alex-grey",
    name: "Alex Grey",
    slug: "alex-grey",
    image: "/images/hero-visionary-2.jpg",
    artworkCount: 45,
  },
  {
    id: "allyson-grey",
    name: "Allyson Grey",
    slug: "allyson-grey",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=600&fit=crop",
    artworkCount: 28,
  },
  {
    id: "android-jones",
    name: "Android Jones",
    slug: "android-jones",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=600&fit=crop",
    artworkCount: 56,
  },
  {
    id: "archives",
    name: "Archives",
    slug: "archives",
    image: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&h=600&fit=crop",
    artworkCount: 89,
  },
  {
    id: "blue-logan",
    name: "Blue Logan",
    slug: "blue-logan",
    image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600&h=600&fit=crop",
    artworkCount: 15,
  },
  {
    id: "books",
    name: "Books",
    slug: "books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop",
    artworkCount: 8,
  },
  {
    id: "chris-dyer",
    name: "Chris Dyer",
    slug: "chris-dyer",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop",
    artworkCount: 22,
  },
  {
    id: "chris-saunders",
    name: "Chris Saunders",
    slug: "chris-saunders",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&h=600&fit=crop",
    artworkCount: 18,
  },
  {
    id: "christopher-pugliese",
    name: "Christopher Pugliese",
    slug: "christopher-pugliese",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=600&fit=crop",
    artworkCount: 14,
  },
  {
    id: "david-lawell",
    name: "David Lawell",
    slug: "david-lawell",
    image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=600&h=600&fit=crop",
    artworkCount: 11,
  },
  {
    id: "hans-haveron",
    name: "Hans Haveron",
    slug: "hans-haveron",
    image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=600&h=600&fit=crop",
    artworkCount: 28,
  },
  {
    id: "jake-kobrin",
    name: "Jake Kobrin",
    slug: "jake-kobrin",
    image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=600&fit=crop",
    artworkCount: 9,
  },
  {
    id: "john-park",
    name: "John Park",
    slug: "john-park",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=600&fit=crop",
    artworkCount: 16,
  },
  {
    id: "joseph-santori",
    name: "Joseph Santori",
    slug: "joseph-santori",
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?w=600&h=600&fit=crop",
    artworkCount: 7,
  },
  {
    id: "luke-brown",
    name: "Luke Brown",
    slug: "luke-brown",
    image: "/images/hero-visionary-1.jpg",
    artworkCount: 32,
  },
  {
    id: "mars-1",
    name: "Mars-1",
    slug: "mars-1",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    artworkCount: 19,
  },
  {
    id: "mear-one",
    name: "Mear One",
    slug: "mear-one",
    image: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&h=600&fit=crop",
    artworkCount: 24,
  },
  {
    id: "michael-divine",
    name: "Michael Divine",
    slug: "michael-divine",
    image: "/images/hero-visionary-3.jpg",
    artworkCount: 38,
  },
  {
    id: "michael-pukac",
    name: "Michael Pukac",
    slug: "michael-pukac",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    artworkCount: 12,
  },
  {
    id: "mimi-yoon",
    name: "Mimi Yoon",
    slug: "mimi-yoon",
    image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&h=600&fit=crop",
    artworkCount: 10,
  },
  {
    id: "mugwort",
    name: "Mugwort",
    slug: "mugwort",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    artworkCount: 22,
  },
  {
    id: "original-works",
    name: "Original Works",
    slug: "original-works",
    image: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&h=600&fit=crop",
    artworkCount: 156,
  },
  {
    id: "rachel-mandala",
    name: "Rachel Mandala",
    slug: "rachel-mandala",
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?w=600&h=600&fit=crop",
    artworkCount: 14,
  },
  {
    id: "sacred-consumption",
    name: "Sacred Consumption",
    slug: "sacred-consumption",
    image: "/images/featured-collection.jpg",
    artworkCount: 24,
  },
  {
    id: "samuel-farrand",
    name: "Samuel Farrand",
    slug: "samuel-farrand",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=600&fit=crop",
    artworkCount: 8,
  },
  {
    id: "sequoia-emmanuelle",
    name: "Sequoia Emmanuelle",
    slug: "sequoia-emmanuelle",
    image: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&h=600&fit=crop",
    artworkCount: 11,
  },
  {
    id: "stella-strzyzowska",
    name: "Stella Strzyzowska",
    slug: "stella-strzyzowska",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=600&fit=crop",
    artworkCount: 9,
  },
  {
    id: "supply-store",
    name: "Supply Store",
    slug: "supply-store",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop",
    artworkCount: 45,
  },
  {
    id: "van-saro",
    name: "Van Saro",
    slug: "van-saro",
    image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600&h=600&fit=crop",
    artworkCount: 6,
  },
  {
    id: "yurik-riegel",
    name: "Yurik Riegel",
    slug: "yurik-riegel",
    image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=600&h=600&fit=crop",
    artworkCount: 13,
  },
];

export default function AllArtists() {
  return (
    <section id="artists" className="py-20 relative">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-8 animate-fade-in">
          <span className="text-gray-600 text-sm">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Collections</span>
          </span>
        </div>

        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-wide">
            ALL ARTISTS
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full" />
        </div>

        {/* Artist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artistCollections.map((artist) => (
            <div
              key={artist.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.random() * 0.3}s` }}
            >
              <Link href={`/artist/${artist.slug}`}>
                <div className="group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4 shadow-lg">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Artwork Count Badge */}
                    <div className="absolute bottom-4 right-4 glass-card px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-gray-900 text-sm font-medium">
                        {artist.artworkCount} works
                      </span>
                    </div>
                  </div>

                  {/* Artist Name */}
                  <h3 className="font-playfair text-lg font-semibold text-black text-center tracking-widest uppercase group-hover:text-purple-600 transition-colors">
                    {artist.name}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
