import { useState } from "react";
import { MapPin, Calendar, Link as LinkIcon, Camera, Heart, MessageCircle, ShoppingBag, UserPlus, Grid3x3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";

type Tab = "activity" | "favorites" | "orders" | "following" | "settings";

interface ActivityItem {
  id: string;
  type: "like" | "comment" | "purchase" | "follow";
  artwork?: string;
  artist?: string;
  comment?: string;
  timestamp: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "like",
    artwork: "Higher Vision",
    artist: "Alex Grey",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "comment",
    artwork: "Spectraleyes",
    artist: "Luke Brown",
    comment: "Absolutely stunning piece!",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    type: "purchase",
    artwork: "Cosmic Vision",
    artist: "Android Jones",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    type: "follow",
    artist: "Michael Divine",
    timestamp: "2 days ago",
  },
  {
    id: "5",
    type: "like",
    artwork: "Urban Dreams",
    artist: "Hans Haveron",
    timestamp: "3 days ago",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("activity");
  const [isLoggedIn] = useState(false); // TODO: Replace with actual auth check

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "purchase":
        return <ShoppingBag className="w-5 h-5 text-green-500" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "like":
        return (
          <>
            Liked <strong>{activity.artwork}</strong> by {activity.artist}
          </>
        );
      case "comment":
        return (
          <>
            Commented on <strong>{activity.artwork}</strong> by {activity.artist}
            {activity.comment && (
              <div className="text-sm text-gray-600 mt-1 italic">"{activity.comment}"</div>
            )}
          </>
        );
      case "purchase":
        return (
          <>
            Purchased <strong>{activity.artwork}</strong> by {activity.artist}
          </>
        );
      case "follow":
        return (
          <>
            Started following <strong>{activity.artist}</strong>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <StarField />
      <Header />
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 relative mt-20">
        <div className="container py-16">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-6xl font-bold text-white">
                S
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                <Camera className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Sparks Paul Michael</h1>
                  <p className="text-white/90 text-lg max-w-2xl">
                    Passionate collector of visionary and psychedelic art. Always seeking pieces that expand consciousness.
                  </p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined Dec 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  <a href="https://myartcollection.com" className="hover:underline">
                    myartcollection.com
                  </a>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">6</div>
                <div className="text-white/80 text-sm">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">12</div>
                <div className="text-white/80 text-sm">Following</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">48</div>
                <div className="text-white/80 text-sm">Followers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === "activity"
                  ? "border-purple-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
              <span className="font-medium">Activity</span>
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === "favorites"
                  ? "border-purple-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">Favorites</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === "orders"
                  ? "border-purple-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Orders</span>
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === "following"
                  ? "border-purple-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-medium">Following</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-purple-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        {!isLoggedIn ? (
          <div className="max-w-3xl mx-auto text-center py-16">
            <div className="bg-gray-50 rounded-xl p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Please Log In</h2>
              <p className="text-gray-600 text-lg mb-8">
                You need to log in to view your profile, leave comments, and customize your data.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                Log In / Sign Up
              </Button>
            </div>
          </div>
        ) : (
          <>
        {activeTab === "activity" && (
          <div className="max-w-3xl">
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900 mb-1">{getActivityText(activity)}</div>
                      <div className="text-sm text-gray-500">{activity.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600">Start favoriting artworks to see them here</p>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Your purchase history will appear here</p>
          </div>
        )}

        {activeTab === "following" && (
          <div className="text-center py-12">
            <UserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Not following anyone yet</h3>
            <p className="text-gray-600">Follow artists to see their latest works</p>
          </div>
        )}
          </>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value="sparks@example.com"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value="••••••••"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                  />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
