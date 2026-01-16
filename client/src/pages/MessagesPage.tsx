import { useState } from "react";
import { Search, MoreVertical, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";

interface Comment {
  id: string;
  user: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface ArtworkComments {
  id: string;
  artworkTitle: string;
  artworkImage: string;
  artist: string;
  lastCommentTime: string;
  commentCount: number;
  comments: Comment[];
}

// Mock data for 20 most recent commented artworks
const artworkComments: ArtworkComments[] = [
  {
    id: "1",
    artworkTitle: "Third Eye Tears Of Joy",
    artworkImage: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop",
    artist: "Alex Grey",
    lastCommentTime: "2m ago",
    commentCount: 15,
    comments: [
      { id: "1", user: "Art Lover", userAvatar: "https://i.pravatar.cc/150?img=1", text: "This piece is absolutely stunning! The detail in the sacred geometry is incredible.", timestamp: "2m ago", likes: 5 },
      { id: "2", user: "Collector", userAvatar: "https://i.pravatar.cc/150?img=2", text: "I've been following Alex Grey's work for years. This is one of his best.", timestamp: "15m ago", likes: 8 },
      { id: "3", user: "Visionary", userAvatar: "https://i.pravatar.cc/150?img=3", text: "The colors and symbolism speak to my soul.", timestamp: "1h ago", likes: 3 },
    ],
  },
  {
    id: "2",
    artworkTitle: "Cosmic Vision",
    artworkImage: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=400&fit=crop",
    artist: "Luke Brown",
    lastCommentTime: "5m ago",
    commentCount: 12,
    comments: [
      { id: "1", user: "Dreamer", userAvatar: "https://i.pravatar.cc/150?img=4", text: "Luke Brown never disappoints. This is a masterpiece.", timestamp: "5m ago", likes: 4 },
      { id: "2", user: "Mystic", userAvatar: "https://i.pravatar.cc/150?img=5", text: "I can see the universe in this painting.", timestamp: "20m ago", likes: 6 },
    ],
  },
  {
    id: "3",
    artworkTitle: "Sacred Geometry",
    artworkImage: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=400&fit=crop",
    artist: "Michael Divine",
    lastCommentTime: "10m ago",
    commentCount: 18,
    comments: [
      { id: "1", user: "Seeker", userAvatar: "https://i.pravatar.cc/150?img=6", text: "The precision and beauty of this work is unmatched.", timestamp: "10m ago", likes: 7 },
      { id: "2", user: "Scholar", userAvatar: "https://i.pravatar.cc/150?img=7", text: "Michael Divine's understanding of sacred geometry is profound.", timestamp: "30m ago", likes: 9 },
    ],
  },
  {
    id: "4",
    artworkTitle: "Digital Dreams",
    artworkImage: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=400&h=400&fit=crop",
    artist: "Android Jones",
    lastCommentTime: "15m ago",
    commentCount: 20,
    comments: [
      { id: "1", user: "Tech Artist", userAvatar: "https://i.pravatar.cc/150?img=8", text: "Android Jones pushes the boundaries of digital art.", timestamp: "15m ago", likes: 10 },
    ],
  },
  {
    id: "5",
    artworkTitle: "Urban Mythology",
    artworkImage: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=400&h=400&fit=crop",
    artist: "Mear One",
    lastCommentTime: "20m ago",
    commentCount: 14,
    comments: [
      { id: "1", user: "Street Art Fan", userAvatar: "https://i.pravatar.cc/150?img=9", text: "Mear One's murals are legendary. This print captures that energy.", timestamp: "20m ago", likes: 6 },
    ],
  },
  {
    id: "6",
    artworkTitle: "Ethereal Landscape",
    artworkImage: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=400&fit=crop",
    artist: "Christopher Pugliese",
    lastCommentTime: "25m ago",
    commentCount: 11,
    comments: [
      { id: "1", user: "Nature Lover", userAvatar: "https://i.pravatar.cc/150?img=10", text: "The way light is captured in this piece is magical.", timestamp: "25m ago", likes: 5 },
    ],
  },
  {
    id: "7",
    artworkTitle: "Mandala Dreams",
    artworkImage: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?w=400&h=400&fit=crop",
    artist: "Rachel Mandala",
    lastCommentTime: "30m ago",
    commentCount: 16,
    comments: [
      { id: "1", user: "Meditation Practitioner", userAvatar: "https://i.pravatar.cc/150?img=11", text: "Perfect for meditation space. The symmetry is perfect.", timestamp: "30m ago", likes: 8 },
    ],
  },
  {
    id: "8",
    artworkTitle: "Botanical Visions",
    artworkImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    artist: "Mugwort",
    lastCommentTime: "35m ago",
    commentCount: 13,
    comments: [
      { id: "1", user: "Plant Spirit", userAvatar: "https://i.pravatar.cc/150?img=12", text: "Mugwort's connection to plant medicine shines through.", timestamp: "35m ago", likes: 7 },
    ],
  },
  {
    id: "9",
    artworkTitle: "Architectural Dreams",
    artworkImage: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=400&fit=crop",
    artist: "Hans Haveron",
    lastCommentTime: "40m ago",
    commentCount: 10,
    comments: [
      { id: "1", user: "Architecture Student", userAvatar: "https://i.pravatar.cc/150?img=13", text: "The impossible structures are mind-bending.", timestamp: "40m ago", likes: 4 },
    ],
  },
  {
    id: "10",
    artworkTitle: "Classical Fusion",
    artworkImage: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400&h=400&fit=crop",
    artist: "John Park",
    lastCommentTime: "45m ago",
    commentCount: 9,
    comments: [
      { id: "1", user: "Art Historian", userAvatar: "https://i.pravatar.cc/150?img=14", text: "Beautiful blend of classical and contemporary.", timestamp: "45m ago", likes: 6 },
    ],
  },
  {
    id: "11",
    artworkTitle: "Celestial Bodies",
    artworkImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    artist: "Mars-1",
    lastCommentTime: "50m ago",
    commentCount: 17,
    comments: [
      { id: "1", user: "Space Enthusiast", userAvatar: "https://i.pravatar.cc/150?img=15", text: "Mars-1 captures the cosmos beautifully.", timestamp: "50m ago", likes: 9 },
    ],
  },
  {
    id: "12",
    artworkTitle: "Modern Expression",
    artworkImage: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400&h=400&fit=crop",
    artist: "Van Saro",
    lastCommentTime: "55m ago",
    commentCount: 8,
    comments: [
      { id: "1", user: "Contemporary Fan", userAvatar: "https://i.pravatar.cc/150?img=16", text: "Van Saro's modern take is refreshing.", timestamp: "55m ago", likes: 5 },
    ],
  },
  {
    id: "13",
    artworkTitle: "Psychedelic Journey",
    artworkImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    artist: "Chris Dyer",
    lastCommentTime: "1h ago",
    commentCount: 19,
    comments: [
      { id: "1", user: "Festival Goer", userAvatar: "https://i.pravatar.cc/150?img=17", text: "Chris Dyer's work always takes me on a journey.", timestamp: "1h ago", likes: 11 },
    ],
  },
  {
    id: "14",
    artworkTitle: "Spiritual Awakening",
    artworkImage: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=400&h=400&fit=crop",
    artist: "Sequoia Emmanuelle",
    lastCommentTime: "1h ago",
    commentCount: 12,
    comments: [
      { id: "1", user: "Spiritual Seeker", userAvatar: "https://i.pravatar.cc/150?img=18", text: "This piece resonates with my spiritual practice.", timestamp: "1h ago", likes: 7 },
    ],
  },
  {
    id: "15",
    artworkTitle: "Feminine Divine",
    artworkImage: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=400&h=400&fit=crop",
    artist: "Allyson Grey",
    lastCommentTime: "1h ago",
    commentCount: 15,
    comments: [
      { id: "1", user: "Divine Feminine", userAvatar: "https://i.pravatar.cc/150?img=19", text: "Allyson Grey's work celebrates the sacred feminine.", timestamp: "1h ago", likes: 8 },
    ],
  },
  {
    id: "16",
    artworkTitle: "Cosmic Consciousness",
    artworkImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop",
    artist: "Luke Brown",
    lastCommentTime: "2h ago",
    commentCount: 14,
    comments: [
      { id: "1", user: "Consciousness Explorer", userAvatar: "https://i.pravatar.cc/150?img=20", text: "This artwork expands my consciousness.", timestamp: "2h ago", likes: 9 },
    ],
  },
  {
    id: "17",
    artworkTitle: "Fractal Universe",
    artworkImage: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=400&h=400&fit=crop",
    artist: "Yurik Riegel",
    lastCommentTime: "2h ago",
    commentCount: 11,
    comments: [
      { id: "1", user: "Math Lover", userAvatar: "https://i.pravatar.cc/150?img=21", text: "The fractal patterns are mathematically beautiful.", timestamp: "2h ago", likes: 6 },
    ],
  },
  {
    id: "18",
    artworkTitle: "Dimensional Shift",
    artworkImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    artist: "Android Jones",
    lastCommentTime: "2h ago",
    commentCount: 16,
    comments: [
      { id: "1", user: "Reality Bender", userAvatar: "https://i.pravatar.cc/150?img=22", text: "This piece shifts my perception of reality.", timestamp: "2h ago", likes: 10 },
    ],
  },
  {
    id: "19",
    artworkTitle: "Sacred Portal",
    artworkImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    artist: "Michael Divine",
    lastCommentTime: "3h ago",
    commentCount: 13,
    comments: [
      { id: "1", user: "Portal Keeper", userAvatar: "https://i.pravatar.cc/150?img=23", text: "This feels like a gateway to another dimension.", timestamp: "3h ago", likes: 7 },
    ],
  },
  {
    id: "20",
    artworkTitle: "Eternal Light",
    artworkImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    artist: "Alex Grey",
    lastCommentTime: "3h ago",
    commentCount: 18,
    comments: [
      { id: "1", user: "Light Worker", userAvatar: "https://i.pravatar.cc/150?img=24", text: "The light in this piece is transcendent.", timestamp: "3h ago", likes: 12 },
    ],
  },
];

export default function MessagesPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const currentArtwork = artworkComments.find((a) => a.id === selectedArtwork);
  const currentComments = currentArtwork?.comments || [];

  const filteredArtworks = artworkComments.filter((artwork) =>
    artwork.artworkTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark">
      <StarField />
      <Header />

      <div className="pt-24 pb-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Artwork Comments</h1>
            <p className="text-gray-400">View and manage comments on artworks</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
            {/* Left Sidebar - Artwork List */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search artworks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredArtworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    onClick={() => setSelectedArtwork(artwork.id)}
                    className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${
                      selectedArtwork === artwork.id
                        ? "bg-purple-600/20 border-l-4 border-l-purple-500"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={artwork.artworkImage}
                        alt={artwork.artworkTitle}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{artwork.artworkTitle}</h3>
                        <p className="text-sm text-gray-400 truncate">by {artwork.artist}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MessageCircle className="w-3 h-3 text-purple-400" />
                          <span className="text-xs text-gray-400">{artwork.commentCount} comments</span>
                          <span className="text-xs text-gray-500">• {artwork.lastCommentTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Comments View */}
            <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
              {currentArtwork ? (
                <>
                  {/* Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={currentArtwork.artworkImage}
                          alt={currentArtwork.artworkTitle}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h2 className="text-xl font-bold">{currentArtwork.artworkTitle}</h2>
                          <p className="text-gray-400">by {currentArtwork.artist}</p>
                          <p className="text-sm text-purple-400 mt-1">{currentArtwork.commentCount} comments</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {currentComments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <img
                          src={comment.userAvatar}
                          alt={comment.user}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="glass-card rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">{comment.user}</span>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-gray-300">{comment.text}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span>{comment.likes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <p>Select an artwork to view comments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
