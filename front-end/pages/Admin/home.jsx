import { useEffect, useState } from "react";
import {
  getAdminDashboard,
  getAssetData,
  getBaseData,
} from "../../controller/AdminDashboardController";
import { getPurchaseData, getTransactions } from "../../controller/AdminPurchase";

function AdminDashboard() {
  const [filters, setFilters] = useState({
    date: "",
    base_id: "",
    asset_id: "",
  });
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [assetsData, setAssetsData] = useState([]);
  const [basesData, setBasesData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const params = {
        asset_id: filters.asset_id,
        base_id: filters.base_id,
        date: filters.date,
      };
      const data = await getAdminDashboard(params);
      if (data?.success) {
        setDashboardData(data.data);
        setLoading(false);
      } else {
        console.error("Error fetching dashboard data:", data?.message);
      }
    };
    fetchDashboardData();
  }, [filters]);

  useEffect(() => {
    const fetchpurchaseData = async () => {
      const params = {
        base_id: filters.base_id,
        asset_id: filters.asset_id,
        date: filters.date,
      };
      const data = await getPurchaseData(params);
      if (data?.success) {
        setPurchaseData(data.data);
      } else {
        console.error("Error fetching purchases:", data?.message);
      }
    };
    fetchpurchaseData();
  }, [filters]);

  useEffect(() => {
    const fetchAssetData = async () => {
      const data = await getAssetData();
      if (data?.success) {
        setAssetsData(data.data);
      } else {
        console.error("Error fetching assets data:", data?.message);
      }
    };

    fetchAssetData();
  }, []);

  useEffect(() => {
    const fetchBaseData = async () => {
      const data = await getBaseData();
      if (data?.success) {
        setBasesData(data.data);
      } else {
        console.error("Error fetching base data:", data?.message);
      }
    };

    fetchBaseData();
  }, []);

  useEffect(() => {
    const fetchTransactionData = async () => {
      const params = {
        asset_id: filters.asset_id,
        base_id: filters.base_id,
        date: filters.date,
      };
      const data = await getTransactions(params);
      if (data?.success) {
        setTransactionData(data.data);
      } else {
        console.error("Error fetching transactions:", data?.message);
      }
    };
    fetchTransactionData();
  }, [filters]);

  const totalAssets = dashboardData.length;
  const purchases = purchaseData.length;
  const assignedAssets = dashboardData.reduce(
    (sum, a) => sum + Number(a.assigned_assets || 0),
    0
  );
  const expendedAssets = dashboardData.reduce(
    (sum, a) => sum + Number(a.expended || 0),
    0
  );
  const transferIn = transactionData.filter(
    (a) => a.status === "transfer-in"
  ).length;
  const transferOut = transactionData.filter(
    (a) => a.status === "transfer-out"
  ).length;
  const netMovement = purchases + transferIn - transferOut;

  return (
    <div className="min-h-screen px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="text-[#F1F2F4] pl-2 text-2xl sm:text-3xl font-semibold border-l-4 rounded border-[#008000] mb-4">
        Dashboard
      </div>

      <div className="bg-[rgb(30,34,41)] p-3 sm:p-4 rounded flex flex-col sm:flex-row gap-3 sm:gap-4 border border-gray-600">
        <select
          value={filters.base_id}
          className="flex-1 bg-[#0F1319] text-[#F1F2F4] p-2 sm:p-3 rounded shadow-md text-sm sm:text-base"
          onChange={(e) => setFilters({ ...filters, base_id: e.target.value })}
        >
          <option className="bg-[rgb(39,44,53)] text-[#F1F2F4]" value="">
            Select Base
          </option>
          {basesData?.map((base) => (
            <option
              className="bg-[rgb(39,44,53)] text-[#F1F2F4]"
              key={base.base_id}
              value={base.base_id}
            >
              {base.base_name}
            </option>
          ))}
        </select>

        <select
          value={filters.asset_id}
          className="flex-1 bg-[#0F1319] text-[#F1F2F4] p-2 sm:p-3 rounded shadow-md text-sm sm:text-base"
          onChange={(e) => setFilters({ ...filters, asset_id: e.target.value })}
        >
          <option
            className="bg-[rgb(39,44,53)] text-[#F1F2F4]"
            value=""
          >
            Select Assets
          </option>
          {assetsData?.map((asset) => (
            <option
              className="bg-[rgb(40,47,58)] text-[#F1F2F4]"
              key={asset.asset_id}
              value={asset.asset_id}
            >
              {asset.asset_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          className="flex-1 bg-[#0F1319] text-[#F1F2F4] p-2 sm:p-3 rounded shadow-md text-sm sm:text-base"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : totalAssets > 0 ? (
        <>
          <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="p-4 border border-l-4 border-l-[#008000] border-gray-600 rounded shadow text-[#F1F2F4] bg-[rgb(30,34,41)]">
              <h2 className="font-semibold text-sm sm:text-base">
                Total Assets
              </h2>
              <p className="text-lg sm:text-xl font-bold">{totalAssets}</p>
            </div>
            <div className="p-4 border border-l-4 border-l-[#008000] border-gray-600 rounded shadow text-[#F1F2F4] bg-[rgb(30,34,41)]">
              <h2 className="font-semibold text-sm sm:text-base">
                Net Movement
              </h2>
              <p className="text-lg sm:text-xl font-bold">{netMovement}</p>
            </div>
            <div className="p-4 border border-l-4 border-l-[#008000] border-gray-600 rounded shadow text-[#F1F2F4] bg-[rgb(30,34,41)]">
              <h2 className="font-semibold text-sm sm:text-base">Purchases</h2>
              <p className="text-lg sm:text-xl font-bold">{purchases}</p>
            </div>
            <div className="p-4 border border-l-4 border-l-[#008000] border-gray-600 rounded shadow text-[#F1F2F4] bg-[rgb(30,34,41)]">
              <h2 className="font-semibold text-sm sm:text-base">Assigned</h2>
              <p className="text-lg sm:text-xl font-bold">{assignedAssets}</p>
            </div>
            <div className="p-4 border border-l-4 border-l-[#008000] border-gray-600 rounded shadow text-[#F1F2F4] bg-[rgb(30,34,41)]">
              <h2 className="font-semibold text-sm sm:text-base">Expended</h2>
              <p className="text-lg sm:text-xl font-bold">{expendedAssets}</p>
            </div>
            <div className="p-4 border border-l-4 border-l-[#008000] border-gray-600 rounded shadow text-[#F1F2F4] bg-[rgb(30,34,41)]">
              <h2 className="font-semibold text-sm sm:text-base">Transfers</h2>
              <div className="flex text-lg sm:text-xl font-bold gap-2 sm:gap-3 flex-wrap">
                <div className="text-[#0bff0b]">IN: {transferIn}</div>
                <div className="hidden sm:block">||</div>
                <div className="text-red-500">OUT: {transferOut}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto border-gray-600 border rounded p-3 text-[#F1F2F4] bg-[rgb(30,34,41)]">
            <h2 className="font-bold text-base sm:text-lg mb-4 pl-3 sm:pl-5 border-l-4 border-l-[#008000] rounded">
              Detailed Breakdown
            </h2>
            <table className="w-full rounded overflow-hidden text-xs sm:text-sm md:text-base">
              <thead>
                <tr>
                  <th className="border-t-2 border-gray-700 p-2">Trax ID</th>
                  <th className="border-t-2 border-gray-700 p-2">Item</th>
                  <th className="border-t-2 border-gray-700 p-2">Base</th>
                  <th className="border-t-2 border-gray-700 p-2">Quantity</th>
                  <th className="border-t-2 border-gray-700 p-2">Status</th>
                  <th className="border-t-2 border-gray-700 p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {[...(transactionData || []), ...(purchaseData || [])]
                  .sort((a, b) => a.transaction_id - b.transaction_id)
                  .map((data) => {
                    const asset_name = assetsData.find(
                      (a) => a.asset_id === data.asset_id
                    );
                    const base_name = basesData.find(
                      (b) => b.base_id === data.base_id
                    );

                    return (
                      <tr key={data.transaction_id} className="text-center">
                        <td className="border-t-2 border-gray-700 p-2">
                          {data.transaction_id}
                        </td>
                        <td className="border-t-2 border-gray-700 p-2">
                          {asset_name ? asset_name.asset_name : data.asset_id}
                        </td>
                        <td className="border-t-2 border-gray-700 p-2">
                          {base_name ? base_name.base_name : data.base_id}
                        </td>
                        <td className="border-t-2 border-gray-700 p-2">
                          {data.quantity}
                        </td>
                        <td
                          className={`border-t-2 border-gray-700 p-2 ${
                            data.status === "purchase" ||
                            data.status === "transfer-in"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {data.status}
                        </td>
                        <td className="border-t-2 border-gray-700 p-2">
                          {data.date}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="mt-4">No data found</p>
      )}
    </div>
  );
}

export default AdminDashboard;
