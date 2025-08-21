import { useState } from "react";
import { assetTransfer, getAssetData, getBaseData, getTransactions } from "../../controller/BaseCommanderDashboard";
import { useEffect } from "react";

function BaseCommanderTransfers() {
     const [assetdata, setAssetData] = useState([]);
  const [basedata, setBaseData] = useState([]);
  const [transferData, setTransferData] = useState({
    asset_id: "",
    other_base_id : "",
    quantity: 0,
    status: ""
  });
  const [transactionData, setTransactionData] = useState([]);

  useEffect(()=>{
    const fetchAssetData = async () =>{
      const data = await getAssetData();
      if(data?.success){
        setAssetData(data?.data);
      } else{
        console.error("Error fetching asset data:", data?.message);
      }
    }
    fetchAssetData();
  },[])

  useEffect(()=>{
    const fetchBaseData = async () =>{
      const data = await getBaseData();
      if(data?.success){
        setBaseData(data?.data);
      } else{
        console.error("Error fetching base data:", data?.message);
      }
    }
    fetchBaseData();
  },[])
  const assetTransferdata = async (data) =>{
    data.preventDefault();
    const payload = {
      asset_id: transferData.asset_id,
      other_base_id: transferData.other_base_id,
      quantity: transferData.quantity,
      status: transferData.status
    }
    const response = await assetTransfer(payload);
    if(response?.success){
      alert("Asset transferred successfully!");
    }else{
      alert("Error transferring asset", response?.message);
    }
  }
  useEffect(()=>{
        const fetchTransactionData = async () =>{
          
          const data = await getTransactions();
          if(data?.success){
            setTransactionData(data.data);
          } else {
            console.error("Error fetching transactions:", data?.message);
          }
        }
        fetchTransactionData();
      }, []);
  return (
    <div className="p-4 mt-3 flex flex-col justify-center items-center ml-38 mr-10">
      <h2 className="text-xl text-center font-bold mb-4">Transfer Asset</h2>
      <form onSubmit={assetTransferdata} className="
       flex flex-col gap-2 max-w-max bg-[#D7D176] rounded p-2 gap-y-3 ">
        <select className="bg-white p-2 font-semibold rounded" 
        value ={transferData.asset_id} onChange={(e)=>setTransferData({...transferData, asset_id: e.target.value})}>
          <option value="">Select Asset</option>
          {assetdata.map(asset=>(
            <option key={asset.asset_id} value={asset.asset_id}>{asset.asset_name}</option>
          ))}
        </select>
        
        <select className="bg-white p-2 font-semibold rounded" 
        value={transferData.other_base_id} onChange={(e)=>setTransferData({...transferData, other_base_id: e.target.value})}>
          <option value="">Select Other Base</option>
          {basedata?.map(base =>(
            <option key={base.base_id} value={base.base_id}>{base.base_name}</option>
          ))}
        </select>
        <input className="bg-white p-2 font-semibold rounded" 
         type="number" value={transferData.quantity} placeholder="Enter Quantity"
        onChange={(e)=>setTransferData({...transferData, quantity: e.target.value})} />

        <select className="bg-white p-2 font-semibold rounded"
        value={transferData.status} onChange={(e)=>setTransferData({...transferData, status: e.target.value})}>
            <option value="">Select Status</option>
          <option value="transfer-out">Transfer Out</option>
        </select>
        <button type="submit" className="border p-2 rounded font-semibold text-center">Transfer</button>
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

            const asset_name = assetdata.find((a)=> a.asset_id === data.asset_id);
            const base_name = basedata.find((b)=> b.base_id === data.base_id);
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
}

export default BaseCommanderTransfers;