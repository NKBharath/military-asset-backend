import API from "../common/axiosInstance"

export const getTransactions = async()=>{
    try{
        const data = await API.get("/admin/gettransactions");
        return data.data;
    }catch(error){
        console.error("Error fetching transactions: controller", error);
    }
}