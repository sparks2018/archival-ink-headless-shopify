// Guest Data Migration System
// Migrates localStorage data to user account when they sign up/login

export interface GuestData {
  cart: any[];
  favorites: any[];
  recentlyViewed: any[];
  preferences: {
    theme?: string;
    notifications?: boolean;
  };
  affiliateAttribution?: {
    code: string;
    timestamp: number;
  };
}

export class GuestDataMigration {
  // Collect all guest data from localStorage
  static collectGuestData(): GuestData {
    const guestData: GuestData = {
      cart: [],
      favorites: [],
      recentlyViewed: [],
      preferences: {},
    };

    try {
      // Cart data
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        try {
          guestData.cart = JSON.parse(cartData) || [];
        } catch {
          guestData.cart = [];
        }
      }

      // Favorites data
      const favoritesData = localStorage.getItem("favorites");
      if (favoritesData) {
        try {
          guestData.favorites = JSON.parse(favoritesData) || [];
        } catch {
          guestData.favorites = [];
        }
      }

      // Recently viewed
      const recentlyViewedData = localStorage.getItem("recentlyViewed");
      if (recentlyViewedData) {
        try {
          guestData.recentlyViewed = JSON.parse(recentlyViewedData) || [];
        } catch {
          guestData.recentlyViewed = [];
        }
      }

      // Theme preference
      const theme = localStorage.getItem("theme");
      if (theme) {
        guestData.preferences.theme = theme;
      }

      // Affiliate attribution
      const affiliateClick = localStorage.getItem("affiliate_click");
      if (affiliateClick) {
        guestData.affiliateAttribution = JSON.parse(affiliateClick);
      }
    } catch (error) {
      console.error("Error collecting guest data:", error);
    }

    return guestData;
  }

  // Migrate guest data to user account
  static async migrateToAccount(userEmail: string, userId?: string): Promise<boolean> {
    const guestData = this.collectGuestData();

    // Check if there's any data to migrate
    const hasData =
      guestData.cart.length > 0 ||
      guestData.favorites.length > 0 ||
      guestData.recentlyViewed.length > 0;

    if (!hasData) {
      console.log("No guest data to migrate");
      return false;
    }

    try {
      // Send to backend API
      const response = await fetch("/api/user/migrate-guest-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          userId,
          guestData,
          timestamp: Date.now(),
        }),
      });

      if (response.ok) {
        console.log("Guest data migrated successfully");
        
        // Mark migration as complete
        localStorage.setItem("guestDataMigrated", "true");
        localStorage.setItem("migratedAt", Date.now().toString());
        
        return true;
      } else {
        console.error("Failed to migrate guest data:", response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Error migrating guest data:", error);
      return false;
    }
  }

  // Clear guest data after successful migration
  static clearGuestData() {
    const keysToKeep = [
      "isAuthenticated",
      "userEmail",
      "userName",
      "userPicture",
      "authProvider",
      "guestDataMigrated",
      "migratedAt",
    ];

    // Get all localStorage keys
    const allKeys = Object.keys(localStorage);

    // Remove all keys except those to keep
    allKeys.forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    console.log("Guest data cleared after migration");
  }

  // Check if migration has already occurred
  static hasMigrated(): boolean {
    return localStorage.getItem("guestDataMigrated") === "true";
  }

  // Merge guest data with existing user data
  static async mergeWithUserData(userEmail: string): Promise<void> {
    try {
      // Fetch existing user data from backend
      const response = await fetch(`/api/user/data?email=${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        console.error("Failed to fetch user data");
        return;
      }

      const userData = await response.json();

      // Merge cart (add guest items to user cart)
      const guestCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (guestCart.length > 0 && userData.cart) {
        // Remove duplicates and merge
        const mergedCart = [...userData.cart];
        guestCart.forEach((guestItem: any) => {
          const exists = mergedCart.some((item: any) => item.id === guestItem.id);
          if (!exists) {
            mergedCart.push(guestItem);
          }
        });
        
        // Update backend
        await fetch("/api/user/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail, cart: mergedCart }),
        });

        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(mergedCart));
      }

      // Merge favorites
      const guestFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (guestFavorites.length > 0 && userData.favorites) {
        const mergedFavorites = [...userData.favorites];
        guestFavorites.forEach((guestFav: any) => {
          const exists = mergedFavorites.some((fav: any) => fav === guestFav);
          if (!exists) {
            mergedFavorites.push(guestFav);
          }
        });

        // Update backend
        await fetch("/api/user/favorites", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail, favorites: mergedFavorites }),
        });

        // Update localStorage
        localStorage.setItem("favorites", JSON.stringify(mergedFavorites));
      }

      console.log("Guest data merged with user data");
    } catch (error) {
      console.error("Error merging guest data:", error);
    }
  }

  // Handle login/signup event
  static async handleAuthEvent(userEmail: string, userId?: string, isNewUser: boolean = false) {
    // Check if already migrated
    if (this.hasMigrated()) {
      console.log("Guest data already migrated");
      return;
    }

    if (isNewUser) {
      // New user: migrate all guest data
      const success = await this.migrateToAccount(userEmail, userId);
      if (success) {
        // Don't clear immediately - let user see their cart/favorites persist
        console.log("Guest data migrated for new user");
      }
    } else {
      // Returning user: merge guest data with existing data
      await this.mergeWithUserData(userEmail);
      
      // Mark as migrated
      localStorage.setItem("guestDataMigrated", "true");
    }
  }

  // Get migration summary for display
  static getMigrationSummary(): { cart: number; favorites: number; total: number } {
    const guestData = this.collectGuestData();
    const cartLength = guestData.cart?.length || 0;
    const favoritesLength = guestData.favorites?.length || 0;
    return {
      cart: cartLength,
      favorites: favoritesLength,
      total: cartLength + favoritesLength,
    };
  }
}

// Export helper function for easy integration
export async function migrateGuestDataOnAuth(
  userEmail: string,
  userId?: string,
  isNewUser: boolean = false
) {
  await GuestDataMigration.handleAuthEvent(userEmail, userId, isNewUser);
}
