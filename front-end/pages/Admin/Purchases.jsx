import { useState, useEffect } from "react";
import { getAssetData, getBaseData } from "../../controller/AdminDashboardController";
import { addAdminAsset } from "../../controller/AdminDashboardController";
import { getTransactions } from "../../controller/AdminPurchase";
const AdminPurchases = () => {
  const [basesData, setBasesData] = useState([]);
  const [base, setBase] = useState(null);
  const [assetsData, setAssetsData] = useState([]);
  const [asset, setAsset] = useState(null);
  const [quantity, setQuantity] = useState();
  const [message, setMessage] = useState("");
  const [transactionData, setTransactionData] = useState([]);
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

      if(!asset || !base || !quantity){
        setMessage("Kindly fill all the fields");
          return;
      }
      const formdata = {
        asset_id: asset,
        base_id: base,
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
        const data = await getTransactions();
        if(data?.success){
          setTransactionData(data.data);
          console.log("Transaction Data:", data.data);
        } else {
          console.error("Error fetching transactions:", data?.message);
        }
      }
      fetchTransactionData();
    }, []);
  return (
    <div className="p-6 ">
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
        <select value={base} onChange={(e)=> setBase(e.target.value)} required
          className="bg-[#ffffff] p-2 font-bold rounded ">
          <option value="">Select Base</option>
          {basesData?.map(base=>(
            <option key={base.base_id} value={base.base_id}>
              {base.base_name}
            </option>
          ))}
        </select>
         <input type="number" min="1" placeholder="Quantity" required 
          className="bg-[#ffffff] p-2 font-bold rounded w-24"
          value={quantity} onChange={(e)=> setQuantity(e.target.value)} />
         <button className="bg-[#ffffff] p-2 font-bold rounded "
         type="submit">Add Item</button>
      </form>
      <table className="w-full mt-6  rounded border-gray-400">
        <thead className="bg-gray-300">
          <th className="border p-2">Transaction ID</th>
          <th className="border p-2">Item</th>
          <th className="border p-2">Base</th>
          <th className="border p-2">Quantity</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Date</th>
        </thead>
        <tbody className="bg-white">
          {transactionData?.map((data) => {

            const asset_name = assetsData.find((a)=> a.asset_id === data.asset_id);
            const base_name = basesData.find((b)=> b.base_id === data.base_id);
            return(
            <tr key={data.transaction_id}>
              <td className="border p-2">{data.transaction_id}</td>
              <td className="border p-2">{asset_name ? asset_name.asset_name : data.asset_id}</td>
              <td className="border p-2">{base_name ? base_name.base_name : data.base_id}</td>
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
};

export default AdminPurchases;
