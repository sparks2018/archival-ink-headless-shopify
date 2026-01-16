import { useState, useEffect } from "react";
import { Globe, Users, Star, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { toast } from "sonner";

export default function SubmitArtPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    artistName: "",
    email: "",
    phone: "",
    website: "",
    instagram: "",
    portfolioLink: "",
    artStyle: "",
    yearsExperience: "",
    artistBio: "",
    artistStatement: "",
    agreeTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    toast.success("Application submitted! We'll review within 3-5 weeks.");
    setFormData({
      artistName: "",
      email: "",
      phone: "",
      website: "",
      instagram: "",
      portfolioLink: "",
      artStyle: "",
      yearsExperience: "",
      artistBio: "",
      artistStatement: "",
      agreeTerms: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <StarField />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-600/20 mb-6">
            <Upload className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Submit Your Art
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join our curated collection of world-renowned visionary artists. We're always looking for exceptional talent.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 mb-4">
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Global Exposure</h3>
              <p className="text-gray-400">
                Reach collectors worldwide through our established platform and marketing channels.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 mb-4">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Artist Community</h3>
              <p className="text-gray-400">
                Join a community of visionary artists including Alex Grey, Android Jones, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 mb-4">
                <Star className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Representation</h3>
              <p className="text-gray-400">
                Professional presentation, high-quality printing, and dedicated artist support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl">
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-2">Artist Application</h2>
            <p className="text-gray-400 mb-8">
              Fill out the form below to submit your work for consideration. Fields marked with * are required.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-white">Basic Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Artist Name *
                    </label>
                    <input
                      type="text"
                      name="artistName"
                      value={formData.artistName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your artist name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Online Presence */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-white">Online Presence</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="@yourusername"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Portfolio Link *
                  </label>
                  <input
                    type="url"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Link to your portfolio (Behance, ArtStation, Google Drive, etc.)"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Please provide a link where we can view at least 10 examples of your work.
                  </p>
                </div>
              </div>

              {/* About Your Art */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-white">About Your Art</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Art Style/Medium
                    </label>
                    <select
                      name="artStyle"
                      value={formData.artStyle}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select your primary style</option>
                      <option value="visionary">Visionary Art</option>
                      <option value="psychedelic">Psychedelic Art</option>
                      <option value="digital">Digital Art</option>
                      <option value="contemporary">Contemporary</option>
                      <option value="abstract">Abstract</option>
                      <option value="surrealism">Surrealism</option>
                      <option value="street">Street Art</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Years of Experience
                    </label>
                    <select
                      name="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select experience level</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Artist Bio *
                  </label>
                  <textarea
                    name="artistBio"
                    value={formData.artistBio}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Tell us about yourself and your artistic journey..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Artist Statement
                  </label>
                  <textarea
                    name="artistStatement"
                    value={formData.artistStatement}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Describe your artistic vision, themes, and what inspires your work..."
                  />
                </div>
              </div>

              {/* Terms & Agreement */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-white">Terms & Agreement</h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">
                      I agree to the terms and conditions of Archival Ink Gallery. I confirm that all submitted work is 
                      original and I hold the rights to it.
                    </span>
                  </label>

                  <p className="text-sm text-gray-400 pl-8">
                    I understand that if accepted, Archival Ink Gallery may request exclusive representation for certain works.
                  </p>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
              >
                Submit Application
              </Button>

              <p className="text-center text-sm text-gray-400">
                Applications are reviewed within 3-5 weeks. We'll contact you via email with our decision.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
