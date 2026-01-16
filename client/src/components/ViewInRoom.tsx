import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

interface ViewInRoomProps {
  isOpen: boolean;
  onClose: () => void;
  artworkImage: string;
  artworkTitle: string;
  artistName: string;
}

type RoomType = "modern" | "minimalist" | "bedroom" | "office" | "gallery";
type SizeType = "S" | "M" | "L" | "X";

const roomBackgrounds = {
  modern: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80",
  minimalist: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=1920&q=80",
  bedroom: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1920&q=80",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
  gallery: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1920&q=80",
};

const roomNames = {
  modern: "Modern Living Room",
  minimalist: "Minimalist Space",
  bedroom: "Bedroom",
  office: "Home Office",
  gallery: "Gallery Wall",
};

const sizeScales = {
  S: 0.5,
  M: 0.7,
  L: 0.9,
  X: 1.1,
};

export default function ViewInRoom({
  isOpen,
  onClose,
  artworkImage,
  artworkTitle,
  artistName,
}: ViewInRoomProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>("modern");
  const [selectedSize, setSelectedSize] = useState<SizeType>("M");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Drag and pinch state - start slightly off-center for natural look
  const [position, setPosition] = useState({ x: -50, y: -30 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Touch pinch state
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  
  const artworkRef = useRef<HTMLDivElement>(null);

  // Reset position and scale when room or size changes
  useEffect(() => {
    // Random slight offset for natural placement
    const randomX = Math.floor(Math.random() * 100) - 50; // -50 to 50
    const randomY = Math.floor(Math.random() * 60) - 30; // -30 to 30
    setPosition({ x: randomX, y: randomY });
    setScale(1);
  }, [selectedRoom, selectedSize]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - drag
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else if (e.touches.length === 2) {
      // Two touches - pinch
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(distance);
      setInitialScale(scale);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      // Single touch - drag
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2) {
      // Two touches - pinch
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = (distance / initialDistance) * initialScale;
      setScale(Math.max(0.5, Math.min(2, newScale))); // Limit scale between 0.5 and 2
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = scale + delta;
    setScale(Math.max(0.5, Math.min(2, newScale)));
  };

  if (!isOpen) return null;

  const baseScale = sizeScales[selectedSize];
  const finalScale = baseScale * scale;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full h-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 p-6 flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-2xl font-bold">{artworkTitle}</h2>
              <p className="text-gray-300">by {artistName}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={toggleFullscreen}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
              >
                <Maximize2 className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Room View */}
          <div className="flex-1 relative overflow-hidden">
            <img
              src={roomBackgrounds[selectedRoom]}
              alt={roomNames[selectedRoom]}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Artwork overlay with drag and pinch */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
            >
              <motion.div
                ref={artworkRef}
                key={`${selectedRoom}-${selectedSize}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${finalScale})`,
                  transformOrigin: 'center',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {/* Elegant Frame */}
                <div className="relative" style={{ maxWidth: "500px" }}>
                  {/* Outer frame (darker wood texture) - extends full height */}
                  <div className="relative bg-gradient-to-br from-amber-950 via-amber-900 to-stone-950 shadow-2xl p-5">
                    {/* Inner frame (gold accent) */}
                    <div className="absolute inset-[20px] border-4 border-amber-700/60"></div>
                    
                    {/* White mat board */}
                    <div className="relative bg-white p-6 shadow-inner">
                      {/* Inner mat shadow */}
                      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"></div>
                      
                      {/* Artwork - maintain actual image proportions */}
                      <div className="relative" style={{ maxWidth: "400px", maxHeight: "600px" }}>
                        <img
                          src={artworkImage}
                          alt={artworkTitle}
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => {
                const rooms: RoomType[] = ["modern", "minimalist", "bedroom", "office", "gallery"];
                const currentIndex = rooms.indexOf(selectedRoom);
                const prevIndex = currentIndex === 0 ? rooms.length - 1 : currentIndex - 1;
                setSelectedRoom(rooms[prevIndex]);
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={() => {
                const rooms: RoomType[] = ["modern", "minimalist", "bedroom", "office", "gallery"];
                const currentIndex = rooms.indexOf(selectedRoom);
                const nextIndex = currentIndex === rooms.length - 1 ? 0 : currentIndex + 1;
                setSelectedRoom(rooms[nextIndex]);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-6 flex items-center justify-between">
            {/* Room Selector */}
            <div className="flex gap-3">
              {(Object.keys(roomNames) as RoomType[]).map((room) => (
                <button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    selectedRoom === room
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  {roomNames[room]}
                </button>
              ))}
            </div>

            {/* Size Selector */}
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">Size:</span>
              <div className="flex gap-2">
                {(["S", "M", "L", "X"] as SizeType[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full font-bold transition-all ${
                      selectedSize === size
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions overlay */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-3 rounded-full backdrop-blur-sm text-sm">
            {isDragging ? "Dragging..." : "Click & drag to move • Pinch or scroll to zoom"}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
