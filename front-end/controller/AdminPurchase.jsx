import API from "../common/axiosInstance"

export const getTransactions = async(params)=>{
    try{
        const data = await API.get("/admin/gettransactions", { params });
        return data.data;
    }catch(error){
        console.error("Error fetching transactions: controller", error);
    }
}