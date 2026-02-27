import api from "../api/api";

export const applicationService = {
  apply: async (internshipId) => {
    const res = await api.post(`/Applications/${internshipId}`);
    return res.data;
  },
};
