import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(false);

  // Auto-close timer: 5 seconds after opening (research-based optimal timing)
  useEffect(() => {
    if (isOpen && cart.length > 0) {
      // Clear any existing timer
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }

      // Start new 5-second timer
      autoCloseTimerRef.current = setTimeout(() => {
        // Only auto-close if user is not hovering
        if (!isHoveringRef.current) {
          onClose();
        }
      }, 5000); // 5 seconds (research-based optimal timing)
    }

    // Cleanup timer on unmount or when cart closes
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };
  }, [isOpen, cart.length, onClose]);

  // Handle mouse enter: pause auto-close
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  };

  // Handle mouse leave: restart auto-close timer
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    if (isOpen && cart.length > 0) {
      autoCloseTimerRef.current = setTimeout(() => {
        if (!isHoveringRef.current) {
          onClose();
        }
      }, 5000); // 5 seconds
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-900 z-[60] flex flex-col shadow-2xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                <span className="px-2 py-1 bg-purple-600 text-white text-sm font-medium rounded-full">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 mb-6">Add some artworks to get started!</p>
                  <Button
                    onClick={onClose}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.artist}</p>
                      <p className="text-lg font-bold text-purple-400 mt-1">${item.price}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>{cartTotal >= 100 ? "Free" : "Calculated at checkout"}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-white pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-6 text-lg"
                  onClick={() => {
                    // Redirect to Shopify checkout
                    // In a real implementation, you would create a checkout session via Shopify API
                    // and redirect to the checkout URL
                    window.location.href = `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/cart`;
                  }}
                  >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Checkout
                </Button>

                <p className="text-center text-xs text-gray-500">
                  Secure checkout powered by Stripe
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
