import API from "../common/axiosInstance";
import { useSelector } from "react-redux";

export const getBaseCommanderDashboard = async (filters = {}, base) => {
  const { transaction_date, category } = filters;
  const params = {};
  if (transaction_date) params.date = transaction_date;   // ✅ send as `date`
  if (category) params.equipment_type = category;         // ✅ send as `equipment_type`
  console.log("Base Commander Dashboard Params:", base);
  try {
    const { data } = await API.get("/base-commander/dashboard", {
      params,
      headers: {
        base: base,
      }
    });
    return data;
  } catch (error) {
    console.error("Error fetching base commander dashboard data:", error);
  }
};
