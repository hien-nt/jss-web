import axiosClient from "./client";

export const FileAPI = {
  uploadFile: (fileData) => {
    const formData = new FormData();
    formData.append("imageFile", fileData);
    return axiosClient.post("/File/uploadFile", formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    });
  },
};
