import { useState } from "react";
import { addAdminAsset, getAssetData, getBaseData, getPurchaseData } from "../../controller/BaseCommanderDashboard";
import { useEffect } from "react";

function BaseCommanderPurchases() {
   const [basesData, setBasesData] = useState([]);
  const [base, setBase] = useState(null);
  const [assetsData, setAssetsData] = useState([]);
  const [asset, setAsset] = useState(null);
  const [quantity, setQuantity] = useState();
  const [message, setMessage] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [filters, setFilters] = useState({
    asset_id: "",
    date: "",
  });
  useEffect(()=>{
      const fetchAssetData = async () => {
        const data = await getAssetData();
        if (data?.success) {
          setAssetsData(data.data);
        } else {
          console.error("Error fetching assets data:", data?.message);
        }
      };
  
      fetchAssetData();
    }, [])
  
    useEffect(()=>{
      const fetchBaseData = async () => {
        const data = await getBaseData();
        if(data?.success){
          setBasesData(data.data);
        } else {
          console.error("Error fetching base data:", data?.message);
        }
      };
  
      fetchBaseData();
    }, []);
  
    const handlesubmit = async(data)=>{
      data.preventDefault();

      if(!asset ||  !quantity){
        setMessage("Kindly fill all the fields");
          return;
      }
      const formdata = {
        asset_id: asset,
        quantity: quantity,
        status: "purchase"
      }
      try{
        const response = await addAdminAsset(formdata);
        if(response?.success){
          alert("Asset added successfully");
          //need to set after checkauth completed window.location.reload();
          setAsset(null);
          setBase(null);
          setQuantity(null);
          setMessage("");
        } else{
          console.error("Error adding asset:", response?.message);
        }
      } catch(error){
        console.error("Error adding asset:", error);
      }
    }

    useEffect(()=>{
      const fetchTransactionData = async () =>{
        const params = {
          asset_id: filters.asset_id,
          date: filters.date
        }
        const data = await getPurchaseData(params);
        if(data?.success){
          setTransactionData(data.data);
        } else {
          console.error("Error fetching transactions:", data?.message);
        }
      }
      fetchTransactionData();
    }, [filters]);
  return (
    <div className="p-6 ml-35 ">
      <h2 className="text-xl font-bold mb-4">Add Asset</h2>
      {message && <p className="text-red-500">{message}</p>}
      <form  onSubmit={handlesubmit} className="space-x-5 bg-[#D7D176] rounded p-4">
        <select value={asset} onChange={(e)=>setAsset(e.target.value) } required
          className="bg-[#ffffff] p-2 font-bold rounded ">
          <option value=""> Select Item</option>
          {assetsData?.map(asset=>(
            <option key={asset.asset_id} value={asset.asset_id}>
              {asset.asset_name}
            </option>
          ))}
        </select>
         <input type="number" min="1" placeholder="Quantity" required 
          className="bg-[#ffffff] p-2 font-bold rounded w-24"
          value={quantity} onChange={(e)=> setQuantity(e.target.value)} />
         <button className="bg-[#ffffff] p-2 font-bold rounded "
         type="submit">Add Item</button>
      </form>


      
      <div className="mt-6 bg-[#D7D176] p-4 rounded space-x-5">
          

        <select value={filters.asset_id} className="bg-[#ffffff] p-2 font-bold rounded "
        onChange={(e)=> setFilters({...filters, asset_id:e.target.value})}>
          <option value="">Select Assets</option>
          {assetsData?.map(asset=>(
            <option key={asset.asset_id} value={asset.asset_id}>
              {asset.asset_name}
            </option>
          ))}
        </select>

        <input type="date" value={filters.date} className="bg-[#ffffff] p-2 font-bold rounded "
        onChange={(e)=> setFilters({...filters, date:e.target.value})} />
      </div>
      

      <table className="w-full mt-6  rounded border-gray-400">
        <thead className="bg-gray-300">
          <th className="border p-2">Transaction ID</th>
          <th className="border p-2">Item</th>
          <th className="border p-2">Quantity</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Date</th>
        </thead>
        <tbody className="bg-white">
          {transactionData?.map((data) => {

            const asset_name = assetsData.find((a)=> a.asset_id === data.asset_id);
            return(
            <tr key={data.transaction_id}>
              <td className="border p-2">{data.transaction_id}</td>
              <td className="border p-2">{asset_name ? asset_name.asset_name : data.asset_id}</td>
              <td className="border p-2">{data.quantity}</td>
              <td className="border p-2">{data.status}</td>
              <td className="border p-2">{data.date}</td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BaseCommanderPurchases;