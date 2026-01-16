import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setEmail("");
    toast.success("Welcome to our community!", {
      description: "You'll receive updates about new artworks and artists.",
    });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, rgba(219, 39, 119, 0.3) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto glow"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 mb-6">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>

          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Our Collector's Circle
          </h2>
          
          <p className="text-gray-700 text-lg mb-8 max-w-xl mx-auto">
            Be the first to discover new artworks, exclusive releases, and special offers from our gallery.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-8"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>

          <p className="text-gray-500 text-sm mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
