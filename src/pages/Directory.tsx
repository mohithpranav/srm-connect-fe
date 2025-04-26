import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, GraduationCap, Building2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../services/student.service";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  branch: string;
  year: number;
  state: string;
  interests: string[];
  skills: string[];
  profilePic?: string;
  language?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
}

interface NormalizedTag {
  original: string; // Original tag text (for display)
  normalized: string; // Normalized version (for comparison)
}

// Define common tech synonyms and related terms
const tagSynonyms: Record<string, string[]> = {
  javascript: ["js", "ecmascript"],
  typescript: ["ts"],
  reactjs: ["react", "reactnative", "react.js"],
  nodejs: ["node", "node.js"],
  python: ["py"],
  fullstack: ["fullstackdeveloper", "fullstackdev", "fullstackdevelopment"],
  frontend: ["frontenddev", "frontenddeveloper", "frontendweb"],
  backend: ["backenddev", "backenddeveloper"],
  machinelearning: ["ml", "deeplearning"],
  artificial: ["ai", "artificialintelligence"],
};

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const branches = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Chemical",
];
const locations = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Gujarat",
  "Tamil Nadu",
];

const getYearSuffix = (year: number) => {
  switch (year) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// Function to normalize tags for better matching
const normalizeTag = (tag: string): string => {
  return tag
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]/g, "") // Remove non-alphanumeric chars
    .replace(/\s+/g, ""); // Remove whitespace
};

// Check if two tags match considering various factors
const tagsMatch = (tag1: string, tag2: string): boolean => {
  const normalized1 = normalizeTag(tag1);
  const normalized2 = normalizeTag(tag2);

  // Direct match
  if (normalized1 === normalized2) {
    return true;
  }

  // Substring match (if one contains the other completely)
  // Only consider if the substring is at least 5 chars to avoid false positives
  if (normalized1.length >= 5 && normalized2.includes(normalized1)) {
    return true;
  }
  if (normalized2.length >= 5 && normalized1.includes(normalized2)) {
    return true;
  }

  // Synonym match
  for (const [baseWord, synonyms] of Object.entries(tagSynonyms)) {
    if (
      (normalized1 === baseWord || synonyms.includes(normalized1)) &&
      (normalized2 === baseWord || synonyms.includes(normalized2))
    ) {
      return true;
    }
  }

  return false;
};

// Function to convert arrays of tag strings to normalized format
const normalizeTags = (tags: string[]): NormalizedTag[] => {
  return tags.map((tag) => ({
    original: tag,
    normalized: normalizeTag(tag),
  }));
};

export default function Directory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [suggestedStudents, setSuggestedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await studentService.getAllStudents();
        console.log("API Response:", response);
        setStudents(response.students);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Generate suggested students based on common skills and interests
  useEffect(() => {
    if (!user || !students.length) return;

    // Find the current user in the students array
    const currentUser = students.find((student) => student.id === user.id);
    if (!currentUser) return;

    // Combine skills and interests for the current user
    const currentUserTags = [
      ...(currentUser.skills || []),
      ...(currentUser.interests || []),
    ];

    // Find other students with 2+ common tags
    const suggestions = students
      .filter((student) => {
        // Don't suggest the current user
        if (student.id === user.id) return false;

        // Combine skills and interests of the other student
        const studentTags = [
          ...(student.skills || []),
          ...(student.interests || []),
        ];

        // Count common tags using advanced matching
        let matchCount = 0;
        for (const currentUserTag of currentUserTags) {
          for (const studentTag of studentTags) {
            if (tagsMatch(currentUserTag, studentTag)) {
              matchCount++;
              break; // Move to next currentUserTag once a match is found
            }
          }
        }

        // Return true if there are at least 2 common tags
        return matchCount >= 2;
      })
      .sort((a, b) => {
        // Calculate similarity scores for sorting
        const aTags = [...(a.skills || []), ...(a.interests || [])];

        const bTags = [...(b.skills || []), ...(b.interests || [])];

        // Count matches for student A
        let aMatchCount = 0;
        for (const currentUserTag of currentUserTags) {
          for (const aTag of aTags) {
            if (tagsMatch(currentUserTag, aTag)) {
              aMatchCount++;
              break;
            }
          }
        }

        // Count matches for student B
        let bMatchCount = 0;
        for (const currentUserTag of currentUserTags) {
          for (const bTag of bTags) {
            if (tagsMatch(currentUserTag, bTag)) {
              bMatchCount++;
              break;
            }
          }
        }

        // Sort by number of common tags (descending)
        return bMatchCount - aMatchCount;
      })
      .slice(0, 5); // Limit to top 5 suggestions

    setSuggestedStudents(suggestions);
  }, [students, user]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase());
      const matchesYear =
        !selectedYear ||
        `${student.year}${getYearSuffix(student.year)} Year` === selectedYear;
      const matchesBranch =
        !selectedBranch || student.branch === selectedBranch;
      const matchesLocation =
        !selectedLocation || student.state === selectedLocation;

      return matchesSearch && matchesYear && matchesBranch && matchesLocation;
    });
  }, [searchQuery, selectedYear, selectedBranch, selectedLocation, students]);

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedBranch("");
    setSelectedLocation("");
    setSearchQuery("");
  };

  const handleViewProfile = (student: Student) => {
    navigate(`/directory/${student.id}`, { state: { student } });
  };

  const handleMessage = (studentId: number) => {
    // Prevent messaging yourself
    if (studentId === user?.id) {
      toast.error("You cannot message yourself");
      return;
    }

    // Navigate to chats with the selected user ID
    navigate(`/chats/${studentId}`, {
      state: {
        selectedUser: students.find((s) => s.id === studentId),
      },
    });
  };

  // Function to find and display common tags between users
  const getCommonTags = (student: Student): string[] => {
    if (!user) return [];

    const currentUser = students.find((s) => s.id === user.id);
    if (!currentUser) return [];

    // Get tags for current user
    const currentUserTags = [
      ...(currentUser.skills || []),
      ...(currentUser.interests || []),
    ];

    // Get tags for student
    const studentTags = [
      ...(student.skills || []),
      ...(student.interests || []),
    ];

    // Find matching tags
    const commonTags: string[] = [];
    const matchedStudentTagIndices = new Set<number>(); // Track which student tags have been matched

    for (const currentUserTag of currentUserTags) {
      for (let i = 0; i < studentTags.length; i++) {
        // Skip if this student tag has already been matched
        if (matchedStudentTagIndices.has(i)) continue;

        if (tagsMatch(currentUserTag, studentTags[i])) {
          commonTags.push(studentTags[i]); // Use student's version of the tag
          matchedStudentTagIndices.add(i); // Mark this tag as matched
          break; // Move to next currentUserTag
        }
      }
    }

    return commonTags;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Smart Suggestions Section */}
      {showSuggestions && suggestedStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-dark flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              People You May Know
            </h2>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-sm text-gray-text hover:text-primary"
            >
              Hide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedStudents.map((student) => (
              <div
                key={`suggestion-${student.id}`}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {student.profilePic ? (
                  <img
                    src={student.profilePic}
                    alt={`${student.firstName || ""} ${student.lastName || ""}`}
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-sm">
                    {(student.firstName?.[0] || "") +
                      (student.lastName?.[0] || "")}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-dark truncate">
                    {[student.firstName, student.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </h3>

                  <div className="mt-1">
                    {getCommonTags(student)
                      .slice(0, 2)
                      .map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-0.5 mr-1 text-xs rounded-full bg-primary-light text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    {getCommonTags(student).length > 2 && (
                      <span className="text-xs text-gray-text">
                        +{getCommonTags(student).length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleViewProfile(student)}
                    className="px-2 py-1 text-xs rounded text-white bg-primary hover:bg-primary-dark"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleMessage(student.id)}
                    className="px-2 py-1 text-xs rounded border border-primary text-primary hover:bg-primary-light"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-text">
          Showing {filteredStudents.length} student
          {filteredStudents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading students...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                {student.profilePic ? (
                  <img
                    src={student.profilePic}
                    alt={`${student.firstName || ""} ${student.lastName || ""}`}
                    className="h-16 w-16 rounded-full object-cover border-4 border-primary"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-xl">
                    {(student.firstName?.[0] || "") +
                      (student.lastName?.[0] || "")}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-dark">
                    {[student.firstName, student.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </h3>
                  {student.branch && (
                    <div className="flex items-center text-sm text-gray-text">
                      <Building2 className="h-4 w-4 mr-1" />
                      {student.branch}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {student.year && (
                  <div className="flex items-center text-sm text-gray-text">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {student.year}
                    {getYearSuffix(student.year)} Year
                  </div>
                )}
                {student.state && (
                  <div className="flex items-center text-sm text-gray-text">
                    <MapPin className="h-4 w-4 mr-2" />
                    {student.state}
                  </div>
                )}
              </div>

              {student.interests && student.interests.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-dark mb-2">
                    Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {student.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs bg-primary-light text-primary"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {student.skills && student.skills.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-dark mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs bg-gray-light text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => handleViewProfile(student)}
                  className="flex-1 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleMessage(student.id)}
                  className="flex-1 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
