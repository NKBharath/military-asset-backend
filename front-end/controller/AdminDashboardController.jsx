import API from "../common/axiosInstance";


export const getAdminDashboard = async(filters = {}) => {
  const{date, base_id, equipment_type} = filters;

  const params ={};
  if(date) params.date = date;
  if(base_id) params.base_id = base_id;
  if(equipment_type) params.equipment_type = equipment_type;

  try{
    const {data} = await API.get("/admin/dashboard", {params});
    return data;
  }catch(error){
    console.error("Error fetching admin dashboard data:", error);
  }
  
}

export const addAdminAsset = async (assetData) => {
  try {
    const { data } = await API.post("/admin/assets", assetData);
    return data;
  } catch (error) {
    console.error("Error adding admin asset:", error);
    return { success: false, message: "Error adding asset" };
  }
};
