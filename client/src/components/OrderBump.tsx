import { useState } from "react";
import { Check, Frame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface OrderBumpProps {
  onAdd: () => void;
  onSkip: () => void;
}

export function OrderBump({ onAdd, onSkip }: OrderBumpProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    setIsAdded(true);
    onAdd();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-6 mb-6"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="bg-purple-600 rounded-full p-3 flex-shrink-0">
          <Frame className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Special Offer: Professional Framing
            </h3>
          </div>
          
          <p className="text-gray-700 mb-3">
            Protect and enhance your artwork with museum-quality framing. 
            <span className="font-semibold text-purple-700"> Save 20% when added to your order!</span>
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-gray-500 line-through">$149.00</div>
            <div className="text-2xl font-bold text-purple-700">$119.00</div>
            <div className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
              SAVE $30
            </div>
          </div>

          <ul className="space-y-2 mb-4 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-600" />
              Museum-quality materials
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-600" />
              UV-protective glass
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-600" />
              Custom-fitted to your artwork
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-600" />
              Ready to hang
            </li>
          </ul>

          {/* Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={isAdded}
                onChange={handleAdd}
                className="w-6 h-6 rounded border-2 border-purple-600 checked:bg-purple-600 checked:border-purple-600 cursor-pointer"
              />
              {isAdded && (
                <Check className="w-4 h-4 text-white absolute top-1 left-1 pointer-events-none" />
              )}
            </div>
            <span className="text-base font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
              Yes! Add professional framing for $119.00
            </span>
          </label>
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="text-sm text-gray-500 hover:text-gray-700 underline mt-4"
      >
        No thanks, I'll frame it myself
      </button>
    </motion.div>
  );
}
