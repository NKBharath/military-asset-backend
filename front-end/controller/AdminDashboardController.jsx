import axios from "axios";

export const getAdminDashboard = async (token) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}` // <-- standard
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    throw error;
  }
};
