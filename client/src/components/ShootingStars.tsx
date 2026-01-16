import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random shooting stars
    const newStars: Star[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      delay: Math.random() * 0.5,
      duration: 0.8 + Math.random() * 0.7,
      size: 60 + Math.random() * 80,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          initial={{ opacity: 0, x: -100, y: 100 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [0, star.size * 10],
            y: [0, -star.size * 10],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            ease: "easeOut",
          }}
        >
          {/* Star head */}
          <div
            className="absolute rounded-full bg-white"
            style={{
              width: 4,
              height: 4,
              boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(147, 51, 234, 0.5)",
            }}
          />
          {/* Star tail */}
          <div
            className="absolute"
            style={{
              width: star.size,
              height: 2,
              background: "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(147,51,234,0.3), transparent)",
              transform: "rotate(-45deg)",
              transformOrigin: "left center",
            }}
          />
        </motion.div>
      ))}

      {/* Additional sparkle particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 0.6,
            delay: Math.random() * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
