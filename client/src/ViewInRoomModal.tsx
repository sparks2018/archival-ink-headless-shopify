import { motion, AnimatePresence } from "framer-motion";
import { X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewInRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  artworkImage: string;
  artworkTitle: string;
}

export default function ViewInRoomModal({
  isOpen,
  onClose,
  artworkImage,
  artworkTitle,
}: ViewInRoomModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-card rounded-2xl p-8 max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-6">
              <Home className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              View in Room
            </h2>

            {/* Description */}
            <p className="text-white/60 text-center mb-6">
              Experience how "{artworkTitle}" would look in your space with our
              augmented reality feature.
            </p>

            {/* Coming Soon Badge */}
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-6 mb-6">
              <p className="text-purple-300 text-center font-medium">
                🎨 This feature is coming soon!
              </p>
              <p className="text-white/60 text-sm text-center mt-2">
                We're working on bringing you an immersive AR experience to
                visualize artworks in your home.
              </p>
            </div>

            {/* Preview Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={artworkImage}
                alt={artworkTitle}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/80 text-center">
                  <Home className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">AR Preview Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // In production, this would open notification signup
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Notify Me
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
