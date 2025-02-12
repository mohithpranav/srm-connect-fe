// import { compressImage } from "../utils/imageCompression";
// import api from "../utils/axios";

// export const profileService = {
//   async updateProfile(formData: FormData) {
//     if (formData.has("profilePic")) {
//       const file = formData.get("profilePic") as File;
//       const compressedImage = await compressImage(file);
//       formData.set("profilePic", compressedImage);
//     }
//     const response = await api.put("/editStudentProfile", formData);
//     return response.data;
//   },
// };
