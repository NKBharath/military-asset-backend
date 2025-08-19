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

export const getAssetData = async()=>{
  try{
    const data = await API.get("/admin/assetsdata");
    return data.data;
  }catch(error){
    console.error("Error fetching assets data: controller", error);
  }
}

export const getBaseData = async () => {
  try {
    const data = await API.get("/admin/basesdata");
    return data.data;
  } catch (error) {
    console.error("Error fetching base data: controller", error);
  }
};

export const addAdminAsset = async (assetData) => {
  try {
    const { data } = await API.post("/admin/storeassets", assetData);
    return data;
  } catch (error) {
    console.error("Error adding admin asset:", error);
  }
};
