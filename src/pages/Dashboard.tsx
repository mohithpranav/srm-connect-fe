import { Users, Code, Gamepad2, Camera, UserCircle } from "lucide-react";

export default function Dashboard() {
  const suggestedMatches = [
    {
      name: "Sarah Chen",
      branch: "Computer Science",
      year: "3rd Year",
      interests: ["Web Development", "AI/ML", "Hackathons"],
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      name: "Alex Kumar",
      branch: "Electronics",
      year: "2nd Year",
      interests: ["Gaming", "Circuit Design", "Robotics"],
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      name: "Priya Sharma",
      branch: "Computer Science",
      year: "4th Year",
      interests: ["UI/UX Design", "Photography", "Music"],
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    },
  ];

  const activities = [
    {
      user: "Rahul Verma",
      action: "is looking for a team for the upcoming Hackathon",
      time: "2h ago",
    },
    {
      user: "Ananya Patel",
      action: "posted about a gaming tournament this weekend",
      time: "4h ago",
    },
    {
      user: "Dev Singh",
      action: "is seeking musicians for the college fest",
      time: "5h ago",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-primary-light rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <img
            className="h-16 w-16 rounded-full border-4 border-primary"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
            alt="Profile"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-dark">
              Welcome back, Aditya!
            </h1>
            <p className="text-gray-text">
              Web Developer | Gamer | Photography Enthusiast
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Find Peers</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                <Code className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Hackathons</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                <Gamepad2 className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Gaming</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                <Camera className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Creative Arts</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-light rounded-lg"
                >
                  <UserCircle className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium text-primary">
                        {activity.user}
                      </span>{" "}
                      {activity.action}
                    </p>
                    <span className="text-xs text-gray-text">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Matches */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Suggested Matches
            </h2>
            <div className="space-y-4">
              {suggestedMatches.map((match, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-light rounded-lg"
                >
                  <img
                    className="h-10 w-10 rounded-full border-2 border-primary"
                    src={match.image}
                    alt={match.name}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-dark">{match.name}</h3>
                    <p className="text-sm text-gray-text">
                      {match.branch} • {match.year}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {match.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-light text-primary"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
