import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  GraduationCap,
  Building2,
  Mail,
  ArrowLeft,
} from "lucide-react";

export default function StudentProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center text-gray-text">Student not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-6 text-gray-text hover:text-gray-dark"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Directory</span>
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b bg-primary-light">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={student.image}
              alt={student.name}
              className="h-32 w-32 rounded-full object-cover border-4 border-primary"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2 text-primary">
                {student.name}
              </h1>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-center md:justify-start text-gray-text">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{student.branch}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-gray-text">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  <span>{student.year}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-gray-text">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{student.location}</span>
                </div>
                {student.email && (
                  <div className="flex items-center justify-center md:justify-start text-gray-text">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>{student.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Bio Section */}
          {student.bio && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">About</h2>
              <p className="text-gray-text leading-relaxed">{student.bio}</p>
            </div>
          )}

          {/* Interests Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {student.interests.map((interest: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm bg-primary-light text-primary"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm bg-gray-light text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate("/chats")}
              className="flex-1 px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
