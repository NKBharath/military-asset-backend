import { useState, useEffect } from "react";
import { getAssetData, getBaseData, addAdminAsset } from "../../controller/AdminDashboardController";
import { getPurchaseData } from "../../controller/AdminPurchase";

const AdminPurchases = () => {
  const [basesData, setBasesData] = useState([]);
  const [base, setBase] = useState(null);
  const [assetsData, setAssetsData] = useState([]);
  const [asset, setAsset] = useState(null);
  const [quantity, setQuantity] = useState();
  const [message, setMessage] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [filters, setFilters] = useState({
    base_id: "",
    asset_id: "",
    date: "",
  });

  useEffect(() => {
    const fetchAssetData = async () => {
      const data = await getAssetData();
      if (data?.success) setAssetsData(data.data);
    };
    fetchAssetData();
  }, []);

  useEffect(() => {
    const fetchBaseData = async () => {
      const data = await getBaseData();
      if (data?.success) setBasesData(data.data);
    };
    fetchBaseData();
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!asset || !base || !quantity) {
      setMessage("Kindly fill all the fields");
      return;
    }
    const formdata = {
      asset_id: asset,
      base_id: base,
      quantity: quantity,
      status: "purchase",
    };
    try {
      const response = await addAdminAsset(formdata);
      if (response?.success) {
        alert("Asset added successfully");
        setAsset(null);
        setBase(null);
        setQuantity(null);
        setMessage("");
      }
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  useEffect(() => {
    const fetchTransactionData = async () => {
      const params = {
        base_id: filters.base_id,
        asset_id: filters.asset_id,
        date: filters.date,
      };
      const data = await getPurchaseData(params);
      if (data?.success) setTransactionData(data.data);
    };
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
        className="bg-[rgb(30,34,41)] p-4 sm:p-6 rounded flex flex-col gap-4 border border-gray-600 w-full md:w-2/3 lg:w-1/2"
      >
        <select
          value={asset || ""}
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

        <select
          value={base || ""}
          onChange={(e) => setBase(e.target.value)}
          required
          className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
        >
          <option value="">Select Base</option>
          {basesData?.map((base) => (
            <option key={base.base_id} value={base.base_id}>
              {base.base_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Quantity"
          required
          className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
          value={quantity || ""}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button
          className="bg-[#008000] hover:bg-green-700 text-white font-medium p-3 rounded shadow-md w-full"
          type="submit"
        >
          Add Item
        </button>
      </form>

      <h2 className="text-[#F1F2F4] text-2xl sm:text-3xl lg:text-4xl font-semibold border-l-4 rounded border-[#008000] mt-7 pl-2">
        Filters
      </h2>

      <div className="bg-[rgb(30,34,41)] mt-4 p-4 sm:p-6 rounded flex flex-col gap-4 border border-gray-600 w-full md:w-2/3 lg:w-1/2">
        <select
          value={filters.base_id}
          className="bg-[#0F1319] text-[#F1F2F4] p-3 rounded shadow-md w-full"
          onChange={(e) => setFilters({ ...filters, base_id: e.target.value })}
        >
          <option value="">Select Base</option>
          {basesData?.map((base) => (
            <option key={base.base_id} value={base.base_id}>
              {base.base_name}
            </option>
          ))}
        </select>

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
        Detailed Breakdown
      </h2>

      <div className="mt-8 overflow-x-auto border-gray-600 border rounded bg-[rgb(30,34,41)]">
        <table className="w-full text-left">
          <thead className="text-sm sm:text-base lg:text-lg text-[#F1F2F4] bg-[#0F1319]">
            <tr>
              <th className="border-t-2 border-gray-700 p-2">Transaction ID</th>
              <th className="border-t-2 border-gray-700 p-2">Item</th>
              <th className="border-t-2 border-gray-700 p-2">Base</th>
              <th className="border-t-2 border-gray-700 p-2">Quantity</th>
              <th className="border-t-2 border-gray-700 p-2">Status</th>
              <th className="border-t-2 border-gray-700 p-2">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm sm:text-base lg:text-lg text-white">
            {transactionData?.map((data) => {
              const asset_name = assetsData.find((a) => a.asset_id === data.asset_id);
              const base_name = basesData.find((b) => b.base_id === data.base_id);
              return (
                <tr key={data.transaction_id}>
                  <td className="border-t-2 border-gray-700 p-2">{data.transaction_id}</td>
                  <td className="border-t-2 border-gray-700 p-2">
                    {asset_name ? asset_name.asset_name : data.asset_id}
                  </td>
                  <td className="border-t-2 border-gray-700 p-2">
                    {base_name ? base_name.base_name : data.base_id}
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
};

export default AdminPurchases;
