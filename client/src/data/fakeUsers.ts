export interface FakeUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
}

export const fakeUsers: FakeUser[] = [
  {
    id: "user1",
    name: "Sarah Chen",
    username: "sarahchen",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "Contemporary art enthusiast and collector based in San Francisco",
  },
  {
    id: "user2",
    name: "Marcus Williams",
    username: "marcusw",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Visionary art lover | Psychedelic explorer | Gallery curator",
  },
  {
    id: "user3",
    name: "Elena Rodriguez",
    username: "elenarod",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Artist and art historian specializing in contemporary spiritual art",
  },
  {
    id: "user4",
    name: "David Park",
    username: "davidpark",
    avatar: "https://i.pravatar.cc/150?img=15",
    bio: "Collector of transformative art | Meditation practitioner",
  },
  {
    id: "user5",
    name: "Jasmine Taylor",
    username: "jasminetay",
    avatar: "https://i.pravatar.cc/150?img=9",
    bio: "Art dealer and consciousness explorer | NYC",
  },
];

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  likes: number;
}

const commentTemplates = [
  "This piece speaks to me on such a deep level. The colors and symbolism are absolutely breathtaking!",
  "Incredible work! The detail and craftsmanship are outstanding. Can't wait to add this to my collection.",
  "This artwork has such powerful energy. I can feel the intention behind every brushstroke.",
  "Absolutely stunning! The way the artist captures transcendence is remarkable.",
  "I've been following this artist for years and this might be their best work yet. Truly transformative.",
  "The symbolism in this piece is so rich and layered. I discover something new every time I look at it.",
  "This is exactly what I've been searching for! The colors are so vibrant and alive.",
  "What a masterpiece! The composition and flow are perfect. This belongs in a museum.",
  "I'm completely mesmerized by this work. The spiritual depth is profound.",
  "This piece has such a unique energy. You can really feel the artist's vision coming through.",
  "Absolutely love this! The intricate details are mind-blowing when you zoom in.",
  "This artwork resonates with my soul. I can't stop coming back to view it.",
  "The technique here is extraordinary. You can see the mastery in every element.",
  "This is the kind of art that changes you. Powerful and deeply moving.",
  "I'm blown away by the depth and complexity of this piece. Truly visionary work.",
  "The energy in this artwork is palpable. It's like it's alive and breathing.",
  "This piece captures something ineffable. Words can't do it justice.",
  "I've never seen anything quite like this. The originality is refreshing.",
  "The way light and shadow play in this work is absolutely magical.",
  "This artwork feels like a portal to another dimension. Absolutely captivating!",
];

// Generate 2 random comments for an artwork
export function generateCommentsForArtwork(artworkId: string): Comment[] {
  const comments: Comment[] = [];
  const usedUsers = new Set<string>();
  
  // Select 2 random users
  const shuffledUsers = [...fakeUsers].sort(() => Math.random() - 0.5);
  const selectedUsers = shuffledUsers.slice(0, 2);
  
  // Generate timestamps within the past month
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  selectedUsers.forEach((user, index) => {
    // Random timestamp within past month
    const randomTime = oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime());
    const timestamp = new Date(randomTime);
    
    // Select random comment template
    const randomIndex = Math.floor(Math.random() * commentTemplates.length);
    const text = commentTemplates[randomIndex];
    
    // Random likes between 0 and 50
    const likes = Math.floor(Math.random() * 51);
    
    comments.push({
      id: `${artworkId}-comment-${index + 1}`,
      userId: user.id,
      text,
      timestamp,
      likes,
    });
  });
  
  // Sort by timestamp (oldest first)
  return comments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

// Get user by ID
export function getUserById(userId: string): FakeUser | undefined {
  return fakeUsers.find((user) => user.id === userId);
}

// Format timestamp for display
export function formatCommentTime(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
