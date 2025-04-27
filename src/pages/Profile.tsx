// import React, { useState, useEffect } from "react";
// import {
//   Github,
//   Linkedin,
//   Plus,
//   X,
//   Edit2,
//   Trash2,
//   AlertCircle,
// } from "lucide-react";
// import { studentService } from "../services/student.service";
// import { toast } from "sonner";
// import {
//   BRANCH_OPTIONS,
//   YEAR_OPTIONS,
//   INDIAN_STATES,
// } from "../constants/profileOptions";

// interface ProfileData {
//   name: string;
//   image: string;
//   branch: string;
//   year: string;
//   dob: string;
//   state: string;
//   linkedinUrl: string;
//   githubUrl: string;
//   interests: string[];
//   skills: string[];
//   languages: string[];
// }

// interface Post {
//   id: number;
//   content: string;
//   timestamp: string;
//   likes: number;
//   comments: number;
//   tags: string[];
// }

// export default function Profile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [newInterest, setNewInterest] = useState("");
//   const [newSkill, setNewSkill] = useState("");
//   const [newLanguage, setNewLanguage] = useState("");
//   const [editingPost, setEditingPost] = useState<number | null>(null);
//   const [editedContent, setEditedContent] = useState("");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
//     null
//   );
//   const [isLoading, setIsLoading] = useState(false);
//   const [stateSearch, setStateSearch] = useState("");
//   const [showStateOptions, setShowStateOptions] = useState(false);

//   const [profileData, setProfileData] = useState<ProfileData>({
//     name: "Aditya Kumar",
//     image:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
//     branch: "Computer Science",
//     year: "3rd Year",
//     dob: "2002-05-15",
//     state: "Maharashtra",
//     linkedinUrl: "https://linkedin.com/in/aditya",
//     githubUrl: "https://github.com/aditya",
//     interests: ["Web Development", "Gaming", "Photography"],
//     skills: ["React", "Node.js", "TypeScript", "Python"],
//     languages: ["English", "Hindi", "Marathi"],
//   });

//   const [posts, setPosts] = useState<Post[]>([
//     {
//       id: 1,
//       content:
//         "Looking for a teammate for the upcoming SIH hackathon! Need someone skilled in machine learning and data analysis. The project idea involves developing an AI-powered solution for healthcare. DM if interested!",
//       timestamp: "2 hours ago",
//       likes: 15,
//       comments: 5,
//       tags: ["Hackathon", "Machine Learning", "Healthcare", "SIH2024"],
//     },
//     {
//       id: 2,
//       content:
//         "Just completed my first full-stack project using React and Node.js! Check out the GitHub repo for more details.",
//       timestamp: "1 day ago",
//       likes: 32,
//       comments: 8,
//       tags: ["WebDev", "React", "NodeJS", "Portfolio"],
//     },
//   ]);

//   // Filter states based on search
//   const filteredStates = INDIAN_STATES.filter((state) =>
//     state.toLowerCase().includes(stateSearch.toLowerCase())
//   );

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest(".state-search-container")) {
//         setShowStateOptions(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const loadProfile = async () => {
//     try {
//       setIsLoading(true);
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       const response = await studentService.getProfile(user.id);

//       setProfileData({
//         name: `${response.student.firstName} ${response.student.lastName}`,
//         image: response.student.profilePic || profileData.image,
//         branch: response.student.branch,
//         year: response.student.year,
//         dob: response.student.dob || "2002-05-15",
//         state: response.student.state,
//         linkedinUrl: response.student.linkedinUrl || "",
//         githubUrl: response.student.githubUrl || "",
//         interests: response.student.interests || [],
//         skills: response.student.skills || [],
//         languages: response.student.language || [],
//       });
//     } catch (err: any) {
//       toast.error(err.message || "Failed to load profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSaveProfile = async () => {
//     try {
//       setIsLoading(true);
//       const user = JSON.parse(localStorage.getItem("user") || "{}");

//       const [firstName, lastName] = profileData.name.split(" ");
//       const profilePayload = {
//         id: user.id,
//         firstName,
//         lastName,
//         branch: profileData.branch,
//         year: parseInt(profileData.year),
//         state: profileData.state,
//         skills: profileData.skills || [],
//         interests: profileData.interests || [],
//         language: profileData.languages || [],
//         profilePic: profileData.image,
//         linkedinUrl: profileData.linkedinUrl,
//         githubUrl: profileData.githubUrl,
//       };

//       console.log("Sending profile payload:", profilePayload);
//       await studentService.editProfile(profilePayload);
//       setIsEditing(false);
//       toast.success("Profile updated successfully");
//       loadProfile();
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEditClick = () => {
//     if (isEditing) {
//       handleSaveProfile();
//     } else {
//       setIsEditing(true);
//     }
//   };

//   const handleAddItem = (
//     type: "interests" | "skills" | "languages",
//     value: string
//   ) => {
//     if (value.trim()) {
//       setProfileData((prev) => ({
//         ...prev,
//         [type]:
//           type === "languages"
//             ? [...prev.languages, value.trim()]
//             : type === "interests"
//             ? [...prev.interests, value.trim()]
//             : [...prev.skills, value.trim()],
//       }));

//       switch (type) {
//         case "interests":
//           setNewInterest("");
//           break;
//         case "skills":
//           setNewSkill("");
//           break;
//         case "languages":
//           setNewLanguage("");
//           break;
//       }
//     }
//   };

//   const handleRemoveItem = (
//     type: "interests" | "skills" | "languages",
//     index: number
//   ) => {
//     setProfileData((prev) => ({
//       ...prev,
//       [type]:
//         type === "languages"
//           ? prev.languages.filter((_, i) => i !== index)
//           : type === "interests"
//           ? prev.interests.filter((_, i) => i !== index)
//           : prev.skills.filter((_, i) => i !== index),
//     }));
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       try {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setProfileData((prev) => ({
//             ...prev,
//             image: reader.result as string,
//           }));
//         };
//         reader.readAsDataURL(file);
//       } catch (err: any) {
//         toast.error("Failed to upload image");
//       }
//     }
//   };

//   const handleEditPost = (post: Post) => {
//     setEditingPost(post.id);
//     setEditedContent(post.content);
//   };

//   const handleSavePost = (postId: number) => {
//     setPosts(
//       posts.map((post) =>
//         post.id === postId ? { ...post, content: editedContent } : post
//       )
//     );
//     setEditingPost(null);
//     setEditedContent("");
//   };

//   const handleDeletePost = (postId: number) => {
//     setPosts(posts.filter((post) => post.id !== postId));
//     setShowDeleteConfirm(null);
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {/* Profile Info Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-primary">Profile</h1>
//           <div className="flex gap-2">
//             {isEditing && (
//               <button
//                 onClick={() => setIsEditing(false)}
//                 disabled={isLoading}
//                 className="px-4 py-2 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               onClick={handleEditClick}
//               disabled={isLoading}
//               className={`px-4 py-2 rounded-lg text-white transition-colors ${
//                 isLoading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-primary hover:bg-primary-dark"
//               }`}
//             >
//               {isLoading
//                 ? "Saving..."
//                 : isEditing
//                 ? "Save Changes"
//                 : "Edit Profile"}
//             </button>
//           </div>
//         </div>

//         <div className="space-y-6">
//           {/* Profile Picture */}
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <img
//                 src={profileData.image}
//                 alt="Profile"
//                 className="w-24 h-24 rounded-full object-cover border-4 border-primary"
//               />
//               {isEditing && (
//                 <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md">
//                   <Plus className="w-4 h-4 text-primary" />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleImageChange}
//                   />
//                 </label>
//               )}
//             </div>
//             <div>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={profileData.name}
//                   onChange={(e) =>
//                     setProfileData((prev) => ({
//                       ...prev,
//                       name: e.target.value,
//                     }))
//                   }
//                   className="text-xl font-semibold p-1 border rounded"
//                 />
//               ) : (
//                 <h2 className="text-xl font-semibold text-gray-dark">
//                   {profileData.name}
//                 </h2>
//               )}
//             </div>
//           </div>

//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Branch Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-dark mb-1">
//                 Branch
//               </label>
//               {isEditing ? (
//                 <select
//                   value={profileData.branch}
//                   onChange={(e) =>
//                     setProfileData((prev) => ({
//                       ...prev,
//                       branch: e.target.value,
//                     }))
//                   }
//                   className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="">Select Branch</option>
//                   {BRANCH_OPTIONS.map((branch) => (
//                     <option key={branch} value={branch}>
//                       {branch}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <p className="text-gray-dark">{profileData.branch}</p>
//               )}
//             </div>

//             {/* Year Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-dark mb-1">
//                 Year
//               </label>
//               {isEditing ? (
//                 <select
//                   value={profileData.year}
//                   onChange={(e) =>
//                     setProfileData((prev) => ({
//                       ...prev,
//                       year: e.target.value,
//                     }))
//                   }
//                   className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="">Select Year</option>
//                   {YEAR_OPTIONS.map((year) => (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <p className="text-gray-dark">{profileData.year}</p>
//               )}
//             </div>

//             {/* State Selection with Search */}
//             <div className="relative state-search-container">
//               <label className="block text-sm font-medium text-gray-dark mb-1">
//                 State
//               </label>
//               {isEditing ? (
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={stateSearch}
//                     onChange={(e) => {
//                       setStateSearch(e.target.value);
//                       setShowStateOptions(true);
//                     }}
//                     onFocus={() => setShowStateOptions(true)}
//                     placeholder="Search state..."
//                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                   {showStateOptions && stateSearch && (
//                     <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-lg shadow-lg">
//                       {filteredStates.map((state) => (
//                         <div
//                           key={state}
//                           onClick={() => {
//                             setProfileData((prev) => ({
//                               ...prev,
//                               state,
//                             }));
//                             setStateSearch(state);
//                             setShowStateOptions(false);
//                           }}
//                           className="w-full p-2 text-left hover:bg-gray-100 cursor-pointer"
//                         >
//                           {state}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-gray-dark">{profileData.state}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-text">
//                 Date of Birth
//               </label>
//               {isEditing ? (
//                 <input
//                   type="date"
//                   value={profileData.dob}
//                   onChange={(e) =>
//                     setProfileData((prev) => ({ ...prev, dob: e.target.value }))
//                   }
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
//                 />
//               ) : (
//                 <p className="mt-1 text-gray-dark">
//                   {new Date(profileData.dob).toLocaleDateString()}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Social Links */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2">
//               <Linkedin className="w-5 h-5 text-primary" />
//               {isEditing ? (
//                 <input
//                   type="url"
//                   value={profileData.linkedinUrl}
//                   onChange={(e) =>
//                     setProfileData((prev) => ({
//                       ...prev,
//                       linkedinUrl: e.target.value,
//                     }))
//                   }
//                   className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
//                 />
//               ) : (
//                 <a
//                   href={profileData.linkedinUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-primary hover:text-primary-dark"
//                 >
//                   {profileData.linkedinUrl}
//                 </a>
//               )}
//             </div>
//             <div className="flex items-center space-x-2">
//               <Github className="w-5 h-5 text-primary" />
//               {isEditing ? (
//                 <input
//                   type="url"
//                   value={profileData.githubUrl}
//                   onChange={(e) =>
//                     setProfileData((prev) => ({
//                       ...prev,
//                       githubUrl: e.target.value,
//                     }))
//                   }
//                   className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
//                 />
//               ) : (
//                 <a
//                   href={profileData.githubUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-primary hover:text-primary-dark"
//                 >
//                   {profileData.githubUrl}
//                 </a>
//               )}
//             </div>
//           </div>

//           {/* Interests */}
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-primary">
//               Interests
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {profileData.interests.map((interest, index) => (
//                 <span
//                   key={index}
//                   className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
//                 >
//                   {interest}
//                   {isEditing && (
//                     <button
//                       onClick={() => handleRemoveItem("interests", index)}
//                       className="ml-2"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                 </span>
//               ))}
//               {isEditing && (
//                 <div className="flex items-center">
//                   <input
//                     type="text"
//                     value={newInterest}
//                     onChange={(e) => setNewInterest(e.target.value)}
//                     placeholder="Add interest"
//                     className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
//                   />
//                   <button
//                     onClick={() => handleAddItem("interests", newInterest)}
//                     className="ml-2 text-primary hover:text-primary-dark"
//                   >
//                     <Plus className="w-5 h-5" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Skills */}
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-primary">Skills</h3>
//             <div className="flex flex-wrap gap-2">
//               {profileData.skills.map((skill, index) => (
//                 <span
//                   key={index}
//                   className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
//                 >
//                   {skill}
//                   {isEditing && (
//                     <button
//                       onClick={() => handleRemoveItem("skills", index)}
//                       className="ml-2"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                 </span>
//               ))}
//               {isEditing && (
//                 <div className="flex items-center">
//                   <input
//                     type="text"
//                     value={newSkill}
//                     onChange={(e) => setNewSkill(e.target.value)}
//                     placeholder="Add skill"
//                     className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
//                   />
//                   <button
//                     onClick={() => handleAddItem("skills", newSkill)}
//                     className="ml-2 text-primary hover:text-primary-dark"
//                   >
//                     <Plus className="w-5 h-5" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Languages */}
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-primary">
//               Languages
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {profileData.languages.map((language, index) => (
//                 <span
//                   key={index}
//                   className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
//                 >
//                   {language}
//                   {isEditing && (
//                     <button
//                       onClick={() => handleRemoveItem("languages", index)}
//                       className="ml-2"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                 </span>
//               ))}
//               {isEditing && (
//                 <div className="flex items-center">
//                   <input
//                     type="text"
//                     value={newLanguage}
//                     onChange={(e) => setNewLanguage(e.target.value)}
//                     placeholder="Add language"
//                     className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50"
//                   />
//                   <button
//                     onClick={() => handleAddItem("languages", newLanguage)}
//                     className="ml-2 text-primary hover:text-primary-dark"
//                   >
//                     <Plus className="w-5 h-5" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Posts Section */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-2xl font-bold mb-6 text-primary">My Posts</h2>
//         <div className="space-y-6">
//           {posts.map((post) => (
//             <div key={post.id} className="border rounded-lg p-4">
//               {editingPost === post.id ? (
//                 <div className="space-y-4">
//                   <textarea
//                     value={editedContent}
//                     onChange={(e) => setEditedContent(e.target.value)}
//                     className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
//                     rows={4}
//                   />
//                   <div className="flex justify-end space-x-2">
//                     <button
//                       onClick={() => {
//                         setEditingPost(null);
//                         setEditedContent("");
//                       }}
//                       className="px-4 py-2 rounded-lg border border-gray-300 text-gray-text hover:bg-gray-light"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={() => handleSavePost(post.id)}
//                       className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex-1">
//                       <p className="text-gray-dark mb-2">{post.content}</p>
//                       <div className="flex flex-wrap gap-2">
//                         {post.tags.map((tag, index) => (
//                           <span
//                             key={index}
//                             className="px-3 py-1 rounded-full text-sm bg-primary-light text-primary"
//                           >
//                             #{tag}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="flex space-x-2 ml-4">
//                       <button
//                         onClick={() => handleEditPost(post)}
//                         className="p-2 rounded-lg hover:bg-gray-light text-gray-text"
//                       >
//                         <Edit2 className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => setShowDeleteConfirm(post.id)}
//                         className="p-2 rounded-lg hover:bg-gray-light text-gray-text"
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-text">
//                     <span>{post.timestamp}</span>
//                     <span className="mx-2">•</span>
//                     <span>{post.likes} likes</span>
//                     <span className="mx-2">•</span>
//                     <span>{post.comments} comments</span>
//                   </div>

//                   {/* Delete Confirmation Dialog */}
//                   {showDeleteConfirm === post.id && (
//                     <div className="mt-4 p-4 bg-gray-light rounded-lg">
//                       <div className="flex items-center mb-3 text-gray-dark">
//                         <AlertCircle className="h-5 w-5 mr-2 text-primary" />
//                         <span>Are you sure you want to delete this post?</span>
//                       </div>
//                       <div className="flex justify-end space-x-2">
//                         <button
//                           onClick={() => setShowDeleteConfirm(null)}
//                           className="px-4 py-2 rounded-lg border border-gray-300 text-gray-text hover:bg-white"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={() => handleDeletePost(post.id)}
//                           className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
// src/components/Profile.tsx
import { useState } from 'react';

// Define interfaces for the component
interface GithubData {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  followers: number;
  following: number;
  repoCount: number;
  profileUrl: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  createdAt: string;
}

interface LeetCodeProblemStats {
  easy: string;
  medium: string;
  hard: string;
}

interface LeetCodeData {
  username: string;
  profileUrl: string;
  ranking: string;
  problemsSolved: string;
  acceptanceRate: string;
  problems: LeetCodeProblemStats;
}

interface ProfileData {
  github: GithubData | null;
  leetcode: LeetCodeData | null;
}

export default function Profile(): JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [leetcodeUrl, setLeetcodeUrl] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const handleGithubSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      setError('Please enter your GitHub URL');
      return;
    }
    setError('');
    setStep(2);
  };
  
  const handleLeetcodeSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!leetcodeUrl.trim()) {
      setError('Please enter your LeetCode URL');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Update the URL to point to your Node.js backend
      const response = await fetch('http://localhost:3000/api/create_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ githubUrl, leetcodeUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json() as ProfileData;
      setProfileData(data);
      setStep(3);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Developer Profile Setup</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {step === 1 && (
        <form onSubmit={handleGithubSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="githubUrl">
              Step 1: Enter your GitHub Profile URL
            </label>
            <input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/yourusername"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Continue
          </button>
        </form>
      )}
      
      {step === 2 && (
        <form onSubmit={handleLeetcodeSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="leetcodeUrl">
              Step 2: Enter your LeetCode Profile URL
            </label>
            <input
              id="leetcodeUrl"
              type="url"
              placeholder="https://leetcode.com/yourusername"
              value={leetcodeUrl}
              onChange={(e) => setLeetcodeUrl(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
      
      {step === 3 && profileData && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Profile Data Retrieved!</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">GitHub Data</h3>
            <div className="bg-white p-3 rounded border">
              <p><span className="font-medium">Username:</span> {profileData.github?.username || 'N/A'}</p>
              <p><span className="font-medium">Repositories:</span> {profileData.github?.repoCount || 0}</p>
              <p><span className="font-medium">Followers:</span> {profileData.github?.followers || 0}</p>
              {/* Display more GitHub data as needed */}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">LeetCode Data</h3>
            <div className="bg-white p-3 rounded border">
              <p><span className="font-medium">Username:</span> {profileData.leetcode?.username || 'N/A'}</p>
              <p><span className="font-medium">Problems Solved:</span> {profileData.leetcode?.problemsSolved || 0}</p>
              <p><span className="font-medium">Ranking:</span> {profileData.leetcode?.ranking || 'N/A'}</p>
              {/* Display more LeetCode data as needed */}
            </div>
          </div>
          
          <button
            onClick={() => {
              setStep(1);
              setProfileData(null);
              setGithubUrl('');
              setLeetcodeUrl('');
            }}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}