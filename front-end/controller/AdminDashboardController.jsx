import API from "../common/axiosInstance";


export const getAdminDashboard = async(filters = {}) => {
  const{start_date, end_date, base, equipment_type} = filters;

  const params ={};
  if(start_date) params.start_date = start_date;
  if(end_date) params.end_date = end_date;
  if(base) params.base = base;
  if(equipment_type) params.equipment_type = equipment_type;

  try{
    const {data} = await API.get("/admin/dashboard", {params});
    return data;
  }catch(error){
    console.error("Error fetching admin dashboard data:", error);
  }
  
}