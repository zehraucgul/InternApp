import api from "../api/api";

export const internshipService = {
  getAll: async () => {
    const response = await api.get("/Internships");
    return response.data;
  },
};
