import React, { useState, useMemo } from 'react';
import { Search, MapPin, GraduationCap, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: number;
  name: string;
  image: string;
  branch: string;
  year: string;
  location: string;
  interests: string[];
  skills: string[];
  bio?: string;
  email?: string;
}

const students: Student[] = [
  {
    id: 1,
    name: "Aditya Kumar",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    branch: "Computer Science",
    year: "3rd Year",
    location: "Maharashtra",
    interests: ["Web Development", "Gaming", "Photography"],
    skills: ["React", "Node.js", "TypeScript"],
    bio: "Passionate about creating innovative web solutions and exploring new technologies.",
    email: "aditya.kumar@example.com"
  },
  {
    id: 2,
    name: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    branch: "Electronics",
    year: "2nd Year",
    location: "Delhi",
    interests: ["Circuit Design", "IoT", "Robotics"],
    skills: ["Arduino", "Python", "PCB Design"],
    bio: "Exploring the intersection of hardware and software in IoT applications.",
    email: "priya.sharma@example.com"
  },
  {
    id: 3,
    name: "Rahul Verma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    branch: "Mechanical",
    year: "4th Year",
    location: "Karnataka",
    interests: ["CAD Design", "3D Printing", "Automotive"],
    skills: ["AutoCAD", "SolidWorks", "3D Modeling"],
    bio: "Mechanical engineering enthusiast with a focus on automotive design.",
    email: "rahul.verma@example.com"
  },
  {
    id: 4,
    name: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    branch: "Computer Science",
    year: "3rd Year",
    location: "Gujarat",
    interests: ["AI/ML", "Data Science", "Research"],
    skills: ["Python", "TensorFlow", "Data Analysis"],
    bio: "AI researcher working on machine learning applications in healthcare.",
    email: "sarah.chen@example.com"
  }
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const branches = ["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical"];
const locations = ["Maharashtra", "Delhi", "Karnataka", "Gujarat", "Tamil Nadu"];

export default function Directory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = !selectedYear || student.year === selectedYear;
      const matchesBranch = !selectedBranch || student.branch === selectedBranch;
      const matchesLocation = !selectedLocation || student.location === selectedLocation;
      
      return matchesSearch && matchesYear && matchesBranch && matchesLocation;
    });
  }, [searchQuery, selectedYear, selectedBranch, selectedLocation]);

  const clearFilters = () => {
    setSelectedYear('');
    setSelectedBranch('');
    setSelectedLocation('');
    setSearchQuery('');
  };

  const handleViewProfile = (student: Student) => {
    navigate(`/directory/${student.id}`, { state: { student } });
  };

  const handleMessage = (studentId: number) => {
    navigate('/chats');
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
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
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
          Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <div key={student.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={student.image}
                  alt={student.name}
                  className="h-16 w-16 rounded-full object-cover border-4 border-primary"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-dark">{student.name}</h3>
                  <div className="flex items-center text-sm text-gray-text">
                    <Building2 className="h-4 w-4 mr-1" />
                    {student.branch}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-text">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {student.year}
                </div>
                <div className="flex items-center text-sm text-gray-text">
                  <MapPin className="h-4 w-4 mr-2" />
                  {student.location}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-dark mb-2">Interests</h4>
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

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-dark mb-2">Skills</h4>
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