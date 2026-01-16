import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
}

interface FavoritesContextType {
  favorites: Artwork[];
  addFavorite: (artwork: Artwork) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (artwork: Artwork) => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Artwork[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("archival-ink-favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("archival-ink-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (artwork: Artwork) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === artwork.id)) return prev;
      return [...prev, artwork];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  const toggleFavorite = (artwork: Artwork) => {
    if (isFavorite(artwork.id)) {
      removeFavorite(artwork.id);
    } else {
      addFavorite(artwork);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
