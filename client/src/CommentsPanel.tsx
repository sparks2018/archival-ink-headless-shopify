import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
}

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  artworkId: string;
  artworkTitle: string;
}

export default function CommentsPanel({
  isOpen,
  onClose,
  artworkId,
  artworkTitle,
}: CommentsPanelProps) {
  // Mock comments - in production, fetch from API
  const [comments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    // In production, submit to API
    console.log("Submitting comment:", commentText);
    setCommentText("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute inset-0 glass-card rounded-2xl p-6 overflow-y-auto z-20"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to details
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-6">
            Comments ({comments.length})
          </h3>

          {/* Comments List or Empty State */}
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-white/40" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">
                No comments yet
              </h4>
              <p className="text-white/60 text-sm mb-6">
                Be the first to share your thoughts!
              </p>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Sign in to comment
              </Button>
            </div>
          ) : (
            <>
              {/* Comments List */}
              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">
                          {comment.user.name}
                        </span>
                        <span className="text-white/40 text-xs">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mb-2">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="text-white/60 hover:text-white text-xs flex items-center gap-1">
                          <span>Like</span>
                          {comment.likes > 0 && (
                            <span>({comment.likes})</span>
                          )}
                        </button>
                        <button className="text-white/60 hover:text-white text-xs">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="border-t border-white/10 pt-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
