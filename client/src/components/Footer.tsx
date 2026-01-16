import { Link } from "wouter";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";

const footerLinks = {
  company: [
    { name: "Original Artwork", href: "#" },
    { name: "The Artists", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Customer Service", href: "#" },
    { name: "Terms", href: "#" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Youtube", icon: Youtube, href: "#" },
];

export default function Footer() {
  const handleLinkClick = () => {
    toast("Feature coming soon");
  };

  return (
    <footer className="relative z-10 glass border-t border-white/10">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/">
              <motion.div
                className="flex items-center cursor-pointer mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-playfair text-2xl font-bold text-white tracking-wide">
                  Archival<span className="text-purple-400">Ink</span>
                </span>
                <span className="font-playfair text-sm text-white/80 ml-2 tracking-widest uppercase">
                  Gallery
                </span>
              </motion.div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Curating visionary and contemporary artwork from world-renowned artists.
              Experience the transcendent beauty of consciousness-expanding art.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-white mb-4 tracking-wide uppercase">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={handleLinkClick}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-white mb-4 tracking-wide uppercase">
              Follow Us
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.button
                  key={social.name}
                  onClick={handleLinkClick}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.button>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-white/40 text-sm">2.3K people like this</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            Copyright © {new Date().getFullYear()}, Archival Ink Gallery
          </p>
        </div>
      </div>
    </footer>
  );
}
