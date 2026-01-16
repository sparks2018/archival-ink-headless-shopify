import { motion } from "framer-motion";
import { Users, Palette, Award, Heart } from "lucide-react";

const stats = [
  {
    icon: Palette,
    value: "500+",
    label: "Artworks",
  },
  {
    icon: Users,
    value: "39+",
    label: "Artists",
  },
  {
    icon: Award,
    value: "25+",
    label: "Years",
  },
  {
    icon: Heart,
    value: "10K+",
    label: "Collectors",
  },
];

export default function StatsBar() {
  return (
    <section className="relative py-8 -mt-16 z-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-8 glow"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 mb-3">
                  <stat.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="font-playfair text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm tracking-widest uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
