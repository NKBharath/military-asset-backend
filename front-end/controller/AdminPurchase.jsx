import API from "../common/axiosInstance"

export const getTransactions = async(params)=>{
    try{
        const data = await API.get("/admin/gettransactions", { params });
        return data.data;
    }catch(error){
        console.error("Error fetching transactions: controller", error);
    }
}

export const getPurchaseData = async(params)=>{
    try{
        const data = await API.get("/admin/getpurchasedata", { params });
        return data.data;
    }catch(error){
        console.error("Error fetching purchase data: controller", error);
    }
}

export const assetTransfer = async (data) =>{
    try{
        const response = await API.post("/admin/transfer", data);
        return response.data;
    }catch(error){
        console.error("Error transferring asset: controller", error);
    }
}