import { Heart, MessageCircle } from "lucide-react";
import { generateCommentsForArtwork, getUserById, formatCommentTime, type Comment } from "../data/fakeUsers";
import { useMemo } from "react";

interface ArtworkCommentsProps {
  artworkId: string;
}

export default function ArtworkComments({ artworkId }: ArtworkCommentsProps) {
  // Generate comments for this artwork (memoized so they don't change on re-render)
  const comments = useMemo(() => generateCommentsForArtwork(artworkId), [artworkId]);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2 text-white">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => {
          const user = getUserById(comment.userId);
          if (!user) return null;

          return (
            <div key={comment.id} className="flex gap-4">
              {/* Avatar */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />

              {/* Comment Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{user.name}</span>
                  <span className="text-sm text-gray-400">@{user.username}</span>
                  <span className="text-sm text-gray-500">·</span>
                  <span className="text-sm text-gray-400">
                    {formatCommentTime(comment.timestamp)}
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed">{comment.text}</p>

                {/* Actions */}
                <div className="flex items-center gap-6 text-gray-400">
                  <button className="flex items-center gap-2 hover:text-purple-400 transition-colors group">
                    <Heart className="w-4 h-4 group-hover:fill-purple-400" />
                    <span className="text-sm">{comment.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Reply</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Comment Input */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex gap-4">
          <img
            src="https://i.pravatar.cc/150?img=33"
            alt="Your avatar"
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              placeholder="Add a comment..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
