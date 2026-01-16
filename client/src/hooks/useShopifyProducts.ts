import { useState, useEffect } from "react";
import { getProducts, getCollections, type ShopifyProduct, type ShopifyCollection } from "@/lib/shopify";
import { transformProducts, transformCollections, type Artwork, type Artist } from "@/lib/shopify-transform";

/**
 * Hook to fetch and transform Shopify products
 */
export function useShopifyProducts() {
  const [products, setProducts] = useState<Artwork[]>([]);
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts(250); // Fetch up to 250 products (Shopify max)
        setShopifyProducts(data);
        setProducts(transformProducts(data));
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { artworks: products, products, shopifyProducts, isLoading, error };
}

/**
 * Hook to fetch and transform Shopify collections (artists)
 */
export function useShopifyCollections() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [shopifyCollections, setShopifyCollections] = useState<ShopifyCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await getCollections(50); // Fetch up to 50 collections
        setShopifyCollections(data);
        setArtists(transformCollections(data));
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch collections:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return { artists, shopifyCollections, isLoading, error };
}
