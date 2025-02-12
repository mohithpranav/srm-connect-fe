import api from "../utils/axios";

interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  branch: string;
  year: number;
  state: string;
  skills: string[];
  interests: string[];
  profilePic?: string;
  language: string[];
  linkedinUrl?: string;
  githubUrl?: string;
}

export const studentService = {
  async getProfile(id: number) {
    const response = await api.get(`/getStudentProfile/${id}`);
    return response.data;
  },

  async setupProfile(data: ProfileData) {
    const response = await api.post("/setUpProfile", data);
    return response.data;
  },

  async editProfile(data: ProfileData) {
    const response = await api.put("/editStudentProfile", data);
    return response.data;
  },

  async getAllStudents() {
    try {
      const response = await api.get("/getAllStudents");
      console.log("Student service response:", response); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error in getAllStudents service:", error);
      throw error;
    }
  },
};
