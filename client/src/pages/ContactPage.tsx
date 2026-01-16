import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <StarField />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-600/20 mb-6">
              <Mail className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a question about our collection? Interested in commissioning a piece? 
              We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium mb-1">Email</h3>
                      <a href="mailto:info@archivalinkgallery.com" className="text-gray-600 hover:text-purple-600 transition-colors">
                        info@archivalinkgallery.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium mb-1">Phone</h3>
                      <a href="tel:+14155551234" className="text-gray-600 hover:text-purple-600 transition-colors">
                        +1 (415) 555-1234
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium mb-1">Location</h3>
                      <p className="text-gray-600">
                        123 Gallery Street<br />
                        San Francisco, CA 94102
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium mb-1">Hours</h3>
                      <p className="text-gray-600">
                        Tue - Sat: 10am - 7pm<br />
                        Sun - Mon: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Visit Our Gallery</h2>
                <p className="text-gray-600 mb-4">
                  Experience our collection in person. Schedule a private viewing or stop by during gallery hours.
                </p>
                <p className="text-sm text-gray-500">
                  2.3K people like this
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
