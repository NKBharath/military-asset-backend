import { useEffect, useState } from "react";
import { getBaseCommanderDashboard } from "../../controller/BaseCommanderDashboard";
import { useSelector } from "react-redux";

function BaseCommanderDashboard() {
  const [filters, setFilters] = useState({
    transaction_date: "",
    category: "",
  });
  const [DashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  console.log("User Base:", user.base);
  const getDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getBaseCommanderDashboard(filters,user.base);
      console.log("Fetched Dashboard Data:", data.data);
      if (data?.success) {
        setDashboardData(data.data);
        console.log("Dashboard data fetched successfully");
      } else {
        console.error("Error fetching dashboard data:", data?.message);
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [filters]);

  const handleChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  // Stats
  const totalAssets = DashboardData.length;
  const purchases = DashboardData.filter((a) => a.action === "purchase").length;
  const transferIn = DashboardData.filter((a) => a.action === "transfer_in").length;
  const transferOut = DashboardData.filter((a) => a.action === "transfer_out").length;
  const netMovement = purchases + transferIn - transferOut;
  const assignedAssets = DashboardData.filter((a) => a.status === "assigned").length;
  const expendedAssets = DashboardData.filter((a) => a.status === "expended").length;

  return (
    <div className="p-6 space-y-6 bg-[#D7D176]">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 rounded-lg">
        <div className="flex gap-3 items-center">
          <label className="block font-semibold mb-1">Date:</label>
          <input
            type="date"
            name="transaction_date"
            value={filters.transaction_date}
            onChange={handleChange}
            className="border-2 border-black p-2 rounded w-40"
          />
        </div>

        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="border-2 border-black p-2 rounded w-40"
        >
          <option value="">Equipment Type</option>
          <option value="Weapon">Weapon</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Communication">Communication</option>
        </select>

        <button
          onClick={getDashboardData}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Dashboard Data */}
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : totalAssets > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded shadow">
            <h2 className="font-semibold">Opening Balance</h2>
            <p>{totalAssets}</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h2 className="font-semibold">Closing Balance</h2>
            <p>{totalAssets}</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h2 className="font-semibold">Net Movement</h2>
            <p>Total: {netMovement}</p>
            <p>Purchases: {purchases}</p>
            <p>Transfer In: {transferIn}</p>
            <p>Transfer Out: {transferOut}</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h2 className="font-semibold">Assigned Assets</h2>
            <p>{assignedAssets}</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h2 className="font-semibold">Expended Assets</h2>
            <p>{expendedAssets}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4">No data found</p>
      )}
    </div>
  );
}

export default BaseCommanderDashboard;
