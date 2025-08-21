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
  <div className="min-h-screen px-2 sm:px-4 md:px-8 lg:px-16 flex flex-col items-center">
    <h2 className="text-[#F1F2F4] text-2xl sm:text-3xl font-semibold border-l-4 rounded border-[#008000] mb-6 pl-2 text-center w-full">
      Transfer Asset
    </h2>

    <form
      onSubmit={assetTransferdata}
      className="bg-[rgb(30,34,41)] p-4 sm:p-6 md:p-8 rounded flex flex-col gap-4 border border-gray-600 w-full sm:w-2/3 lg:w-1/2"
    >
      <select
        className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
        value={transferData.asset_id}
        onChange={(e) => setTransferData({ ...transferData, asset_id: e.target.value })}
      >
        <option value="">Select Asset</option>
        {assetdata.map((asset) => (
          <option key={asset.asset_id} value={asset.asset_id}>
            {asset.asset_name}
          </option>
        ))}
      </select>

      <select
        className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
        value={transferData.other_base_id}
        onChange={(e) => setTransferData({ ...transferData, other_base_id: e.target.value })}
      >
        <option value="">Select Other Base</option>
        {basedata?.map((base) => (
          <option key={base.base_id} value={base.base_id}>
            {base.base_name}
          </option>
        ))}
      </select>

      <input
        className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
        type="number"
        value={transferData.quantity}
        placeholder="Enter Quantity"
        onChange={(e) => setTransferData({ ...transferData, quantity: e.target.value })}
      />

      <select
        className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
        value={transferData.status}
        onChange={(e) => setTransferData({ ...transferData, status: e.target.value })}
      >
        <option value="">Select Status</option>
        <option value="transfer-out">Transfer Out</option>
      </select>

      <button
        type="submit"
        className="bg-[#008000] hover:bg-green-700 text-white font-medium p-3 rounded shadow-md w-full transition"
      >
        Transfer
      </button>
    </form>

    <div className="mt-10 overflow-x-auto border border-gray-600 rounded text-[#F1F2F4] bg-[rgb(30,34,41)] w-full sm:w-5/6 lg:w-2/3">
      <table className="w-full rounded overflow-hidden text-xs sm:text-sm md:text-base">
        <thead className="bg-[#0F1319]">
          <tr>
            <th className="border-t-2 border-gray-700 p-2">Transaction ID</th>
            <th className="border-t-2 border-gray-700 p-2">Item</th>
            <th className="border-t-2 border-gray-700 p-2">Base</th>
            <th className="border-t-2 border-gray-700 p-2">Quantity</th>
            <th className="border-t-2 border-gray-700 p-2">Status</th>
            <th className="border-t-2 border-gray-700 p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactionData?.map((data) => {
            const asset_name = assetdata.find((a) => a.asset_id === data.asset_id);
            const base_name = basedata.find((b) => b.base_id === data.base_id);
            return (
              <tr key={data.transaction_id} className="text-center">
                <td className="border-t-2 border-gray-700 p-2">{data.transaction_id}</td>
                <td className="border-t-2 border-gray-700 p-2">
                  {asset_name ? asset_name.asset_name : data.asset_id}
                </td>
                <td className="border-t-2 border-gray-700 p-2">
                  {base_name ? base_name.base_name : data.base_id}
                </td>
                <td className="border-t-2 border-gray-700 p-2">{data.quantity}</td>
                <td
                  className={`border-t-2 border-gray-700 p-2 ${
                    data.status === "transfer-in" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {data.status}
                </td>
                <td className="border-t-2 border-gray-700 p-2">{data.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

}

export default BaseCommanderTransfers;