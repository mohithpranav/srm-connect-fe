import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, GraduationCap, Building2 } from "lucide-react";
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

export default function Directory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
