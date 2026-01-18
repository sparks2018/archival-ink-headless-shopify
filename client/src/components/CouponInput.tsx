import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CouponInputProps {
  onApply: (code: string, discount: number) => void;
}

const VALID_COUPONS = {
  "COMEBACK10": { discount: 0.10, description: "10% off your order" },
  "WELCOME15": { discount: 0.15, description: "15% off your first order" },
  "ARTIST20": { discount: 0.20, description: "20% off selected artists" },
  "FREESHIP": { discount: 0, description: "Free shipping", freeShipping: true },
};

export function CouponInput({ onApply }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const handleApply = () => {
    const upperCode = code.toUpperCase();
    const coupon = VALID_COUPONS[upperCode as keyof typeof VALID_COUPONS];

    if (coupon) {
      setIsApplied(true);
      setIsInvalid(false);
      setAppliedCoupon(upperCode);
      onApply(upperCode, coupon.discount);
    } else {
      setIsInvalid(true);
      setIsApplied(false);
      setTimeout(() => setIsInvalid(false), 3000);
    }
  };

  const handleRemove = () => {
    setIsApplied(false);
    setAppliedCoupon(null);
    setCode("");
    onApply("", 0);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">Have a coupon code?</h3>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            disabled={isApplied}
            className={`w-full px-4 py-3 border-2 rounded-lg font-mono uppercase transition-all ${
              isApplied
                ? "border-green-500 bg-green-50 text-green-700"
                : isInvalid
                ? "border-red-500 bg-red-50"
                : "border-gray-300 focus:border-purple-500"
            } focus:outline-none disabled:opacity-60`}
          />
          {isApplied && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
          )}
          {isInvalid && (
            <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
          )}
        </div>

        {!isApplied ? (
          <button
            onClick={handleApply}
            disabled={!code}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        ) : (
          <button
            onClick={handleRemove}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <AnimatePresence>
        {isApplied && appliedCoupon && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2"
          >
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Coupon applied: {appliedCoupon}
              </p>
              <p className="text-xs text-green-700">
                {VALID_COUPONS[appliedCoupon as keyof typeof VALID_COUPONS].description}
              </p>
            </div>
          </motion.div>
        )}

        {isInvalid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
          >
            <X className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">
              Invalid coupon code. Please try again.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular codes hint */}
      {!isApplied && !isInvalid && (
        <div className="text-xs text-gray-500">
          Try: <span className="font-mono font-semibold">COMEBACK10</span> or{" "}
          <span className="font-mono font-semibold">WELCOME15</span>
        </div>
      )}
    </div>
  );
}
