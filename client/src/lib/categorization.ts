/**
 * Intelligent Category System for Archival Ink Gallery
 * Combines product types with keyword-based thematic categorization
 */

import type { Artwork } from "@/hooks/useShopifyProducts";

// Thematic keyword mappings
const THEMATIC_KEYWORDS: Record<string, string[]> = {
  "Psychedelic": [
    "psychedelic", "lsd", "dmt", "trippy", "fractal", "kaleidoscope",
    "third eye", "consciousness expansion", "hallucin", "trip"
  ],
  "Visionary": [
    "visionary", "consciousness", "awakening", "enlightenment", "transcendent",
    "alex grey", "allyson grey", "vision", "prophetic"
  ],
  "Spiritual": [
    "spiritual", "sacred", "divine", "meditation", "buddha", "zen", "mystical",
    "goddess", "deity", "holy", "soul", "chakra", "prayer"
  ],
  "Sacred Geometry": [
    "geometry", "geometric", "mandala", "fibonacci", "flower of life", "metatron",
    "patterns", "symmetr", "hexagon", "pentagon", "spiral"
  ],
  "Metaphysical": [
    "metaphysical", "cosmic", "universe", "astral", "ethereal", "dimensional",
    "creation", "cosmos", "celestial", "quantum", "multiverse"
  ],
  "Surrealism": [
    "surreal", "dream", "fantasy", "imagination", "abstract", "surrealist",
    "bizarre", "otherworldly", "dreamscape"
  ],
  "Nature": [
    "nature", "organic", "botanical", "forest", "earth", "flora", "fauna",
    "tree", "plant", "leaf", "flower", "animal", "wildlife"
  ]
};

// Product type categories (from Shopify productType)
export const PRODUCT_TYPE_CATEGORIES = [
  { id: "all", label: "All Formats", value: "" },
  { id: "prints", label: "Prints", value: "PRINTS" },
  { id: "giclee", label: "Giclee on Canvas", value: "GICLEE ON CANVAS" },
  { id: "originals", label: "Originals", value: "ORIGINAL" }
];

// Thematic categories (keyword-based)
export const THEMATIC_CATEGORIES = [
  { id: "all", label: "All Themes" },
  { id: "psychedelic", label: "Psychedelic" },
  { id: "visionary", label: "Visionary" },
  { id: "spiritual", label: "Spiritual" },
  { id: "sacred-geometry", label: "Sacred Geometry" },
  { id: "metaphysical", label: "Metaphysical" },
  { id: "surrealism", label: "Surrealism" },
  { id: "nature", label: "Nature" }
];

/**
 * Categorize artwork based on title, description, and artist name
 */
export function categorizeArtwork(artwork: Artwork): string[] {
  const searchText = `
    ${artwork.title} 
    ${artwork.description || ""} 
    ${artwork.artist}
  `.toLowerCase();

  const categories: string[] = [];

  // Check each thematic category
  for (const [category, keywords] of Object.entries(THEMATIC_KEYWORDS)) {
    const hasMatch = keywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      categories.push(category);
    }
  }

  return categories;
}

/**
 * Check if artwork matches a thematic category
 */
export function matchesThematicCategory(
  artwork: Artwork, 
  categoryId: string
): boolean {
  if (categoryId === "all") return true;

  const categories = categorizeArtwork(artwork);
  const categoryLabel = THEMATIC_CATEGORIES.find(c => c.id === categoryId)?.label;

  return categoryLabel ? categories.includes(categoryLabel) : false;
}

/**
 * Check if artwork matches a product type category
 */
export function matchesProductType(
  artwork: Artwork, 
  productTypeValue: string
): boolean {
  if (!productTypeValue) return true; // "All" selected

  return artwork.category?.toUpperCase().includes(productTypeValue.toUpperCase()) || false;
}

/**
 * Filter artworks by both product type and thematic category
 */
export function filterArtworks(
  artworks: Artwork[],
  productTypeValue: string,
  thematicCategoryId: string,
  searchQuery?: string,
  priceRange?: [number, number],
  selectedArtists?: string[],
  selectedMediums?: string[]
): Artwork[] {
  return artworks.filter(artwork => {
    // Product type filter
    if (!matchesProductType(artwork, productTypeValue)) {
      return false;
    }

    // Thematic category filter
    if (!matchesThematicCategory(artwork, thematicCategoryId)) {
      return false;
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        artwork.title.toLowerCase().includes(query) ||
        artwork.artist.toLowerCase().includes(query) ||
        artwork.description?.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange;
      if (artwork.price < min || artwork.price > max) {
        return false;
      }
    }

    // Artist filter
    if (selectedArtists && selectedArtists.length > 0) {
      if (!selectedArtists.includes(artwork.artist)) {
        return false;
      }
    }

    // Medium filter
    if (selectedMediums && selectedMediums.length > 0) {
      const artworkMedium = artwork.category || "";
      const matchesMedium = selectedMediums.some(medium =>
        artworkMedium.toLowerCase().includes(medium.toLowerCase())
      );
      if (!matchesMedium) return false;
    }

    return true;
  });
}

/**
 * Get artwork count for each thematic category
 */
export function getCategoryCounts(artworks: Artwork[]): Record<string, number> {
  const counts: Record<string, number> = {
    "all": artworks.length
  };

  THEMATIC_CATEGORIES.forEach(category => {
    if (category.id !== "all") {
      counts[category.id] = artworks.filter(artwork =>
        matchesThematicCategory(artwork, category.id)
      ).length;
    }
  });

  return counts;
}

/**
 * Get artwork count for each product type
 */
export function getProductTypeCounts(artworks: Artwork[]): Record<string, number> {
  const counts: Record<string, number> = {
    "all": artworks.length
  };

  PRODUCT_TYPE_CATEGORIES.forEach(category => {
    if (category.id !== "all") {
      counts[category.id] = artworks.filter(artwork =>
        matchesProductType(artwork, category.value)
      ).length;
    }
  });

  return counts;
}
