import api from "../utils/axios";

export const postService = {
  async createPost(content: string) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const response = await api.post("/createPost", {
      studentId: user.id,
      content,
    });
    return response.data;
  },

  async getAllPosts() {
    const response = await api.get("/getAllPosts");
    return response.data;
  },
};
