import React, { useState } from "react";
import {
  Github,
  Linkedin,
  Plus,
  X,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface ProfileData {
  name: string;
  image: string;
  branch: string;
  year: string;
  dob: string;
  state: string;
  linkedinUrl: string;
  githubUrl: string;
  interests: string[];
  skills: string[];
  languages: string[];
}

interface Post {
  id: number;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Aditya Kumar",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    branch: "Computer Science",
    year: "3rd Year",
    dob: "2002-05-15",
    state: "Maharashtra",
    linkedinUrl: "https://linkedin.com/in/aditya",
    githubUrl: "https://github.com/aditya",
    interests: ["Web Development", "Gaming", "Photography"],
    skills: ["React", "Node.js", "TypeScript", "Python"],
    languages: ["English", "Hindi", "Marathi"],
  });

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      content:
        "Looking for a teammate for the upcoming SIH hackathon! Need someone skilled in machine learning and data analysis. The project idea involves developing an AI-powered solution for healthcare. DM if interested!",
      timestamp: "2 hours ago",
      likes: 15,
      comments: 5,
      tags: ["Hackathon", "Machine Learning", "Healthcare", "SIH2024"],
    },
    {
      id: 2,
      content:
        "Just completed my first full-stack project using React and Node.js! Check out the GitHub repo for more details.",
      timestamp: "1 day ago",
      likes: 32,
      comments: 8,
      tags: ["WebDev", "React", "NodeJS", "Portfolio"],
    },
  ]);

  const handleAddItem = (
    type: "interests" | "skills" | "languages",
    value: string
  ) => {
    if (value.trim()) {
      setProfileData((prev) => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));

      switch (type) {
        case "interests":
          setNewInterest("");
          break;
        case "skills":
          setNewSkill("");
          break;
        case "languages":
          setNewLanguage("");
          break;
      }
    }
  };

  const handleRemoveItem = (
    type: "interests" | "skills" | "languages",
    index: number
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post.id);
    setEditedContent(post.content);
  };

  const handleSavePost = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, content: editedContent } : post
      )
    );
    setEditingPost(null);
    setEditedContent("");
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter((post) => post.id !== postId));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profileData.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md">
                  <Plus className="w-4 h-4 text-primary" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="text-xl font-semibold p-1 border rounded"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-dark">
                  {profileData.name}
                </h2>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-text">
                Branch
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.branch}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      branch: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
                />
              ) : (
                <p className="mt-1 text-gray-dark">{profileData.branch}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-text">
                Year
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.year}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      year: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
                />
              ) : (
                <p className="mt-1 text-gray-dark">{profileData.year}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-text">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={profileData.dob}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
                />
              ) : (
                <p className="mt-1 text-gray-dark">
                  {new Date(profileData.dob).toLocaleDateString()}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-text">
                State
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.state}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
                />
              ) : (
                <p className="mt-1 text-gray-dark">{profileData.state}</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Linkedin className="w-5 h-5 text-primary" />
              {isEditing ? (
                <input
                  type="url"
                  value={profileData.linkedinUrl}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      linkedinUrl: e.target.value,
                    }))
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
                />
              ) : (
                <a
                  href={profileData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark"
                >
                  {profileData.linkedinUrl}
                </a>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Github className="w-5 h-5 text-primary" />
              {isEditing ? (
                <input
                  type="url"
                  value={profileData.githubUrl}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
                />
              ) : (
                <a
                  href={profileData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark"
                >
                  {profileData.githubUrl}
                </a>
              )}
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveItem("interests", index)}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add interest"
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  />
                  <button
                    onClick={() => handleAddItem("interests", newInterest)}
                    className="ml-2 text-primary hover:text-primary-dark"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveItem("skills", index)}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill"
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  />
                  <button
                    onClick={() => handleAddItem("skills", newSkill)}
                    className="ml-2 text-primary hover:text-primary-dark"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData.languages.map((language, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
                >
                  {language}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveItem("languages", index)}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add language"
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  />
                  <button
                    onClick={() => handleAddItem("languages", newLanguage)}
                    className="ml-2 text-primary hover:text-primary-dark"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">My Posts</h2>
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              {editingPost === post.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingPost(null);
                        setEditedContent("");
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-text hover:bg-gray-light"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSavePost(post.id)}
                      className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <p className="text-gray-dark mb-2">{post.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 rounded-lg hover:bg-gray-light text-gray-text"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(post.id)}
                        className="p-2 rounded-lg hover:bg-gray-light text-gray-text"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-text">
                    <span>{post.timestamp}</span>
                    <span className="mx-2">•</span>
                    <span>{post.likes} likes</span>
                    <span className="mx-2">•</span>
                    <span>{post.comments} comments</span>
                  </div>

                  {/* Delete Confirmation Dialog */}
                  {showDeleteConfirm === post.id && (
                    <div className="mt-4 p-4 bg-gray-light rounded-lg">
                      <div className="flex items-center mb-3 text-gray-dark">
                        <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                        <span>Are you sure you want to delete this post?</span>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-text hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
