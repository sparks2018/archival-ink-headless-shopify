import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getCollections, ShopifyCollection } from "@/lib/shopify";

export default function AllArtists() {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const data = await getCollections(50);
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">ALL ARTISTS</h1>
            <div className="h-1 w-24 bg-purple-600 mx-auto mb-12"></div>
            <p className="text-gray-600">Loading collections...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">ALL ARTISTS</h1>
          <div className="h-1 w-24 bg-purple-600 mx-auto"></div>
        </div>

        {/* Artist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.map((collection) => {
            // Get the first product image from the collection, or use collection image
            const imageUrl = 
              collection.products?.edges?.[0]?.node?.images?.edges?.[0]?.node?.url ||
              collection.image?.url ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop";

            return (
              <Link
                key={collection.id}
                href={`/artist/${collection.handle}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={imageUrl}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-300" />
                
                {/* Artist Name */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-white font-bold text-lg tracking-wider uppercase">
                    {collection.title}
                  </h3>
                  {collection.products?.edges && (
                    <p className="text-white/70 text-sm mt-1">
                      {collection.products.edges.length} {collection.products.edges.length === 1 ? 'artwork' : 'artworks'}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
