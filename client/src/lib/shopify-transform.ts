/**
 * Shopify Data Transformation Utilities
 * 
 * Transforms Shopify API responses into the format expected by Manus components
 */

import type { ShopifyProduct, ShopifyCollection } from "./shopify";

/**
 * Manus Artwork Type (what components expect)
 */
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  soldOut?: boolean;
  variantId?: string; // Shopify variant ID for cart
  handle?: string; // Shopify product handle
  dimensions?: string;
  editionSize?: string;
  medium?: string;
  paperWeight?: string;
  description?: string;
}

/**
 * Manus Artist Type (what components expect)
 */
export interface Artist {
  id: string;
  name: string;
  slug: string;
  image: string;
  bio?: string;
  artworkCount?: number;
}

/**
 * Transform Shopify Product to Manus Artwork
 */
export function transformProduct(product: ShopifyProduct): Artwork {
  const firstVariant = product.variants.edges[0]?.node;
  const firstImage = product.images.edges[0]?.node;
  
  // Get artist from vendor or metafield
  const artistMetafield = product.metafields?.find((m) => m && m.key === "artist");
  const artist = artistMetafield?.value || product.vendor || "Unknown Artist";
  
  // Get category from productType or metafield
  const categoryMetafield = product.metafields?.find((m) => m && m.key === "category");
  const category = categoryMetafield?.value || product.productType || "Prints";
  
  // Get price
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  
  // Get compare at price (original price)
  const originalPrice = product.compareAtPriceRange?.minVariantPrice
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : undefined;
  
  // Check if sold out
  const soldOut = !firstVariant?.availableForSale;
  
  // Get additional product details from metafields
  const dimensionsMetafield = product.metafields?.find((m) => m && m.key === "dimensions");
  const editionSizeMetafield = product.metafields?.find((m) => m && m.key === "edition_size");
  const mediumMetafield = product.metafields?.find((m) => m && m.key === "medium");
  const paperWeightMetafield = product.metafields?.find((m) => m && m.key === "paper_weight");
  
  return {
    id: product.id,
    title: product.title,
    artist,
    price,
    originalPrice,
    image: firstImage?.url || "/placeholder-artwork.jpg",
    category,
    soldOut,
    variantId: firstVariant?.id,
    handle: product.handle,
    dimensions: dimensionsMetafield?.value,
    editionSize: editionSizeMetafield?.value,
    medium: mediumMetafield?.value,
    paperWeight: paperWeightMetafield?.value,
    description: product.description,
  };
}

/**
 * Transform multiple Shopify Products to Manus Artworks
 */
export function transformProducts(products: ShopifyProduct[]): Artwork[] {
  return products
    .filter((product) => product != null) // Filter out null/undefined products
    .map(transformProduct)
    .filter((artwork) => artwork != null); // Filter out null/undefined artworks
}

/**
 * Transform Shopify Collection to Manus Artist
 */
export function transformCollection(collection: ShopifyCollection): Artist {
  const firstProduct = collection.products.edges[0]?.node;
  const firstImage = firstProduct?.images.edges[0]?.node;
  
  return {
    id: collection.id,
    name: collection.title,
    slug: collection.handle,
    image: collection.image?.url || firstImage?.url || "/placeholder-artist.jpg",
    bio: collection.description,
    artworkCount: collection.products.edges.length,
  };
}

/**
 * Transform multiple Shopify Collections to Manus Artists
 */
export function transformCollections(collections: ShopifyCollection[]): Artist[] {
  return collections
    .filter((collection) => collection != null) // Filter out null/undefined collections
    .map(transformCollection)
    .filter((artist) => artist != null); // Filter out null/undefined artists
}

/**
 * Get featured products from Shopify products
 * (products with "featured" tag or metafield)
 */
export function getFeaturedProducts(products: ShopifyProduct[]): ShopifyProduct[] {
  return products.filter((product) => {
    const hasFeaturedTag = product.tags.some(
      (tag) => tag.toLowerCase() === "featured"
    );
    const hasFeaturedMetafield = product.metafields?.some(
      (m) => m && m.key === "featured" && m.value === "true"
    );
    return hasFeaturedTag || hasFeaturedMetafield;
  });
}

/**
 * Get products by artist (vendor or collection)
 */
export function getProductsByArtist(
  products: ShopifyProduct[],
  artistName: string
): ShopifyProduct[] {
  return products.filter((product) => {
    const artistMetafield = product.metafields?.find((m) => m && m.key === "artist");
    const artist = artistMetafield?.value || product.vendor;
    return artist.toLowerCase() === artistName.toLowerCase();
  });
}

/**
 * Get products by category
 */
export function getProductsByCategory(
  products: ShopifyProduct[],
  category: string
): ShopifyProduct[] {
  return products.filter((product) => {
    const categoryMetafield = product.metafields?.find((m) => m && m.key === "category");
    const productCategory = categoryMetafield?.value || product.productType;
    return productCategory.toLowerCase() === category.toLowerCase();
  });
}

/**
 * Sort products by price
 */
export function sortProductsByPrice(
  products: ShopifyProduct[],
  order: "asc" | "desc" = "asc"
): ShopifyProduct[] {
  return [...products].sort((a, b) => {
    const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
    const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
    return order === "asc" ? priceA - priceB : priceB - priceA;
  });
}

/**
 * Sort products by title
 */
export function sortProductsByTitle(
  products: ShopifyProduct[],
  order: "asc" | "desc" = "asc"
): ShopifyProduct[] {
  return [...products].sort((a, b) => {
    return order === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });
}

/**
 * Filter products by price range
 */
export function filterProductsByPriceRange(
  products: ShopifyProduct[],
  min: number,
  max: number
): ShopifyProduct[] {
  return products.filter((product) => {
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    return price >= min && price <= max;
  });
}

/**
 * Search products by title, artist, or tags
 */
export function searchProducts(
  products: ShopifyProduct[],
  query: string
): ShopifyProduct[] {
  const lowerQuery = query.toLowerCase();
  
  return products.filter((product) => {
    const titleMatch = product.title.toLowerCase().includes(lowerQuery);
    const vendorMatch = product.vendor.toLowerCase().includes(lowerQuery);
    const tagsMatch = product.tags.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );
    const artistMetafield = product.metafields?.find((m) => m && m.key === "artist");
    const artistMatch = artistMetafield?.value?.toLowerCase().includes(lowerQuery);
    
    return titleMatch || vendorMatch || tagsMatch || artistMatch;
  });
}
