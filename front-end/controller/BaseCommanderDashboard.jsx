import API from "../common/axiosInstance";
import { useSelector } from "react-redux";

export const getBaseCommanderDashboard = async (params) => {
  try {
    const { data } = await API.get("/base-commander/dashboard", { params });
    return data;
  } catch (error) {
    console.error("Error fetching base commander dashboard data:", error);
  }
};

export const getAssetData = async()=>{
  try{
    const data = await API.get("base-commander/assetsdata");
    return data.data;
  }catch(error){
    console.error("Error fetching assets data: controller", error);
  }
}

export const getBaseData = async () => {
  try {
    const data = await API.get("base-commander/basedata");
    return data.data;
  } catch (error) {
    console.error("Error fetching base data: controller", error);
  }
};

export const addAdminAsset = async (assetData) => {
  try {
    const { data } = await API.post("base-commander/purchase", assetData);
    return data;
  } catch (error) {
    console.error("Error adding admin asset:", error);
  }
};

export const getTransactions = async(params)=>{
    try{
        const data = await API.get("/base-commander/gettransactionsdata", { params });
        return data.data;
    }catch(error){
        console.error("Error fetching transactions: controller", error);
    }
}

export const getPurchaseData = async(params)=>{
    try{
        const data = await API.get("/base-commander/getpurchasedata", { params });
        return data.data;
    }catch(error){
        console.error("Error fetching purchase data: controller", error);
    }
}

export const assetTransfer = async (data) =>{
    try{
        const response = await API.post("/base-commander/transfer", data);
        return response.data;
    }catch(error){
        console.error("Error transferring asset: controller", error);
    }
}