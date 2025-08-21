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
  <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
    <h2 className="text-[#F1F2F4] text-2xl sm:text-3xl lg:text-4xl font-semibold border-l-4 rounded border-[#008000] mb-4 pl-2">
      Add Asset
    </h2>

    {message && <p className="text-red-500">{message}</p>}

    <form
      onSubmit={handlesubmit}
      className="bg-[rgb(30,34,41)] p-4 sm:p-6 rounded flex flex-col md:flex-row gap-4 border border-gray-600 w-full md:w-2/3 "
    >
      <select
        value={asset}
        onChange={(e) => setAsset(e.target.value)}
        required
        className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
      >
        <option value="">Select Item</option>
        {assetsData?.map((asset) => (
          <option key={asset.asset_id} value={asset.asset_id}>
            {asset.asset_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        placeholder="Quantity"
        required
        className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full md:w-32"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button
        className="bg-[#008000] hover:bg-green-700 text-white font-medium p-3 rounded shadow-md w-full md:w-auto lg:w-1/2"
        type="submit"
      >
        Add Item
      </button>
    </form>

    <h2 className="text-[#F1F2F4] text-2xl sm:text-3xl lg:text-4xl font-semibold border-l-4 rounded border-[#008000] mt-7 pl-2">
        Filters
      </h2>

    <div className="mt-6 bg-[rgb(30,34,41)] p-4 sm:p-6 rounded flex flex-col md:flex-row gap-4 border border-gray-600 w-full md:w-2/3 lg:w-1/2">
      <select
        value={filters.asset_id}
        className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
        onChange={(e) => setFilters({ ...filters, asset_id: e.target.value })}
      >
        <option value="">Select Assets</option>
        {assetsData?.map((asset) => (
          <option key={asset.asset_id} value={asset.asset_id}>
            {asset.asset_name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filters.date}
        className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
      />
    </div>

    <h2 className="text-[#F1F2F4] text-xl sm:text-2xl lg:text-3xl font-bold mt-10 mb-3 pl-5 border-l-4 border-[#008000] rounded">
      Transactions
    </h2>

    <div className="mt-6 overflow-x-auto border border-gray-600 rounded bg-[rgb(30,34,41)]">
      <table className="w-full text-left">
        <thead className="text-sm sm:text-base lg:text-lg text-[#F1F2F4] bg-[#0F1319]">
          <tr>
            <th className="border-t-2 border-gray-700 p-2">Transaction ID</th>
            <th className="border-t-2 border-gray-700 p-2">Item</th>
            <th className="border-t-2 border-gray-700 p-2">Quantity</th>
            <th className="border-t-2 border-gray-700 p-2">Status</th>
            <th className="border-t-2 border-gray-700 p-2">Date</th>
          </tr>
        </thead>
        <tbody className="text-sm sm:text-base lg:text-lg text-white">
          {transactionData?.map((data) => {
            const asset_name = assetsData.find((a) => a.asset_id === data.asset_id);
            return (
              <tr key={data.transaction_id}>
                <td className="border-t-2 border-gray-700 p-2">{data.transaction_id}</td>
                <td className="border-t-2 border-gray-700 p-2">
                  {asset_name ? asset_name.asset_name : data.asset_id}
                </td>
                <td className="border-t-2 border-gray-700 p-2">{data.quantity}</td>
                <td className="border-t-2 border-gray-700 p-2">{data.status}</td>
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

export default BaseCommanderPurchases;