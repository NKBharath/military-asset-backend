import API from "../common/axiosInstance";


export const getBaseCommanderDashboard = async(filters = {}) => {
  const{start_date, end_date, equipment_type} = filters;

  const params ={};
  if(start_date) params.start_date = start_date;
  if(end_date) params.end_date = end_date;
  if(equipment_type) params.equipment_type = equipment_type;

  try{
    const {data} = await API.get("/base-commander/dashboard", {params});
    return data;
  }catch(error){
    console.error("Error fetching base commander dashboard data:", error);
  }
  
}