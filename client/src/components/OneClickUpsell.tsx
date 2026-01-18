import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, X, CreditCard } from "lucide-react";

interface UpsellProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  originalPrice: number;
  upsellPrice: number;
  savings: number;
}

interface OneClickUpsellProps {
  product: UpsellProduct;
  onAccept: (productId: string) => Promise<void>;
  onDecline: () => void;
}

export function OneClickUpsell({ product, onAccept, onDecline }: OneClickUpsellProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept(product.id);
      setIsAccepted(true);
      setTimeout(() => {
        onDecline(); // Close after success
      }, 2000);
    } catch (error) {
      console.error("Upsell failed:", error);
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white relative">
            <button
              onClick={onDecline}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              disabled={isProcessing}
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Wait! Special Offer</h2>
            </div>
            <p className="text-purple-100">Complete your collection with this exclusive deal</p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="md:w-1/2">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Product Details */}
              <div className="md:w-1/2 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>

                {/* Pricing */}
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Regular Price:</span>
                    <span className="text-gray-500 line-through text-lg">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Your Price:</span>
                    <span className="text-3xl font-bold text-purple-700">
                      ${product.upsellPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">
                      Save ${product.savings.toFixed(2)} ({Math.round((product.savings / product.originalPrice) * 100)}% OFF)
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                <ul className="space-y-2 mb-6 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    One-click checkout (no re-entering payment info)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    Ships with your current order
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    This offer expires in 5 minutes
                  </li>
                </ul>

                {/* Actions */}
                <div className="space-y-3 mt-auto">
                  {!isAccepted ? (
                    <>
                      <button
                        onClick={handleAccept}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Yes! Add to My Order
                          </>
                        )}
                      </button>
                      <button
                        onClick={onDecline}
                        disabled={isProcessing}
                        className="w-full text-gray-600 hover:text-gray-800 font-semibold py-2 transition-colors"
                      >
                        No thanks, I'll pass on this deal
                      </button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center justify-center gap-3"
                    >
                      <Check className="w-6 h-6 text-green-600" />
                      <span className="text-green-800 font-bold">
                        Added to your order!
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-600">
            <p>🔒 Secure checkout • 30-day money-back guarantee • Free shipping</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
