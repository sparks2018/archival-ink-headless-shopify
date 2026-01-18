import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart, Heart, X } from "lucide-react";
import { GuestDataMigration } from "../lib/guestDataMigration";

export function MigrationNotification() {
  const [show, setShow] = useState(false);
  const [summary, setSummary] = useState({ cart: 0, favorites: 0, total: 0 });

  useEffect(() => {
    // Check if we just completed a migration
    const migrated = localStorage.getItem("guestDataMigrated");
    const migratedAt = localStorage.getItem("migratedAt");
    
    if (migrated === "true" && migratedAt) {
      const timeSinceMigration = Date.now() - parseInt(migratedAt);
      
      // Show notification if migration happened in last 10 seconds
      if (timeSinceMigration < 10000) {
        const migrationSummary = GuestDataMigration.getMigrationSummary();
        
        if (migrationSummary.total > 0) {
          setSummary(migrationSummary);
          setShow(true);
          
          // Auto-hide after 8 seconds
          setTimeout(() => {
            setShow(false);
          }, 8000);
        }
      }
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 right-4 z-50 max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl border-2 border-purple-200 p-4">
          <div className="flex items-start gap-3">
            {/* Success Icon */}
            <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">
                Welcome back! Your items are safe 🎉
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                We've preserved everything you were browsing:
              </p>

              <div className="space-y-2 text-sm">
                {summary.cart > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                    <span>
                      <strong>{summary.cart}</strong> item{summary.cart !== 1 ? "s" : ""} in your cart
                    </span>
                  </div>
                )}
                {summary.favorites > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Heart className="w-4 h-4 text-purple-600" />
                    <span>
                      <strong>{summary.favorites}</strong> favorite{summary.favorites !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Your data now syncs across all your devices!
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShow(false)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
