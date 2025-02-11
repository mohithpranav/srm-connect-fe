import React, { useState } from 'react';
import { UserCircle, ThumbsUp, MessageCircle as CommentIcon, Share2, Plus, X } from 'lucide-react';

interface Post {
  id: number;
  user: {
    name: string;
    image: string;
    branch: string;
    year: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: {
      name: "Aditya Kumar",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
      branch: "Computer Science",
      year: "3rd Year"
    },
    content: "Looking for a teammate for the upcoming SIH hackathon! Need someone skilled in machine learning and data analysis. The project idea involves developing an AI-powered solution for healthcare. DM if interested!",
    timestamp: "2 hours ago",
    likes: 15,
    comments: 5,
    tags: ["Hackathon", "Machine Learning", "Healthcare", "SIH2024"]
  },
  {
    id: 2,
    user: {
      name: "Priya Sharma",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
      branch: "Electronics",
      year: "2nd Year"
    },
    content: "Anyone interested in forming a team for the robotics competition next month? Looking for people with experience in Arduino and sensor integration.",
    timestamp: "5 hours ago",
    likes: 12,
    comments: 8,
    tags: ["Robotics", "Arduino", "TeamNeeded"]
  }
];

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', tags: [] });
  const [newTag, setNewTag] = useState('');

  const handleCreatePost = () => {
    if (newPost.content.trim()) {
      const post: Post = {
        id: posts.length + 1,
        user: {
          name: "Aditya Kumar",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
          branch: "Computer Science",
          year: "3rd Year"
        },
        content: newPost.content,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        tags: newPost.tags
      };

      setPosts([post, ...posts]);
      setNewPost({ content: '', tags: [] });
      setIsCreatingPost(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newPost.tags.includes(newTag.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
            value={newPost.content}
            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
            placeholder="What's on your mind?"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            rows={4}
          />

          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tags (press Enter)"
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddTag}
                className="p-2 rounded-lg bg-primary-light text-primary"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

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
            {/* Post Header */}
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={post.user.image}
                alt={post.user.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <h3 className="font-semibold text-gray-dark">{post.user.name}</h3>
                <p className="text-sm text-gray-text">
                  {post.user.branch} • {post.user.year} • {post.timestamp}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-dark mb-4">{post.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Post Actions */}
            <div className="flex items-center space-x-6 pt-4 border-t">
              <button className="flex items-center space-x-2 text-gray-text hover:text-primary">
                <ThumbsUp className="h-5 w-5" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-text hover:text-primary">
                <CommentIcon className="h-5 w-5" />
                <span>{post.comments}</span>
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