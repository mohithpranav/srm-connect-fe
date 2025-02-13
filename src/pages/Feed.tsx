import { useState, useEffect } from "react";
import {
  UserCircle,
  ThumbsUp,
  MessageCircle as CommentIcon,
  Share2,
  Plus,
  X,
} from "lucide-react";
import { postService } from "../services/post.service";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

interface Post {
  id: number;
  content: string;
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
    profilePic: string;
    branch: string;
    year: string;
  };
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postService.getAllPosts();
      setPosts(response);
    } catch (error) {
      toast.error("Failed to fetch posts");
    }
  };

  const handleCreatePost = async () => {
    try {
      if (newPostContent.trim()) {
        await postService.createPost(newPostContent);
        setNewPostContent("");
        setIsCreatingPost(false);
        await fetchPosts();
        toast.success("Post created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Create Post Button */}
      {!isCreatingPost && (
        <button
          onClick={() => setIsCreatingPost(true)}
          className="w-full bg-white rounded-lg shadow-md p-4 mb-6 flex items-center space-x-2 text-primary hover:text-primary-dark"
        >
          <Plus className="h-5 w-5" />
          <span>Create a new post</span>
        </button>
      )}

      {/* Create Post Modal */}
      {isCreatingPost && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Create Post</h2>
            <button onClick={() => setIsCreatingPost(false)}>
              <X className="h-5 w-5 text-gray-text" />
            </button>
          </div>

          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            rows={4}
          />

          <button
            onClick={handleCreatePost}
            className="w-full py-2 rounded-lg text-white bg-primary hover:bg-primary-dark"
          >
            Post
          </button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={post.student.profilePic || "/default-avatar.png"}
                alt={`${post.student.firstName} ${post.student.lastName}`}
                className="h-12 w-12 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <h3 className="font-semibold text-gray-dark">
                  {post.student.firstName} {post.student.lastName}
                </h3>
                <p className="text-sm text-gray-text">
                  {post.student.branch} • {post.student.year} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-gray-dark mb-4">{post.content}</p>

            <div className="flex items-center space-x-6 pt-4 border-t">
              <button className="flex items-center space-x-2 text-gray-text hover:text-primary">
                <ThumbsUp className="h-5 w-5" />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-text hover:text-primary">
                <CommentIcon className="h-5 w-5" />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-text hover:text-primary">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
