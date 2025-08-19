import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../controller/AdminDashboardController";

function AdminDashboard() {
  const [filters, setFilters] = useState({
    date: "",
    base_id: "",
    equipment_type: "",
  });
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getAdminDashboard(filters);
      if (data?.success) {
        setDashboardData(data.data);
        console.log("Dashboard data fetched successfully:", data.data);
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

  // --- Totals across all bases ---
  const totalAssets = dashboardData.length;
  const purchases = dashboardData.reduce((sum, a) => sum + Number(a.purchases || 0), 0);
  const assignedAssets = dashboardData.reduce((sum, a) => sum + Number(a.assigned_assets || 0), 0);
  const expendedAssets = dashboardData.reduce((sum, a) => sum + Number(a.expended || 0), 0);
  const transferIn = dashboardData.reduce((sum, a) => sum + Number(a.transaction_in || 0), 0);
  const transferOut = dashboardData.reduce((sum, a) => sum + Number(a.transaction_out || 0), 0);
  const netMovement = dashboardData.reduce((sum, a) => sum + Number(a.net_movement || 0), 0);

  return (
    <div className="p-6 space-y-6 bg-[#D7D176] h-fit">
      {/* --- Filters --- */}
      <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-white shadow">
        <div className="flex gap-3 items-center">
          <label className="block font-semibold mb-1">Start Date:</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="border-2 border-black p-2 rounded w-40"
          />
        </div>

        <select
  name="base_id"
  value={filters.base_id}
  onChange={handleChange}
  className="border-2 border-black p-2 rounded w-40"
>
  <option value="">All Bases</option>
  <option value="Alpha">Base Alpha</option>
  <option value="Bravo">Base Bravo</option>
  <option value="Charlie">Base Charlie</option>
</select>


        <select
          name="equipment_type"
          value={filters.equipment_type}
          onChange={handleChange}
          className="border-2 border-black p-2 rounded w-40"
        >
          <option value="">All Equipment</option>
          <option>Weapon</option>
          <option>Vehicle</option>
          <option>Communication</option>
        </select>

        <button
          onClick={getDashboardData}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* --- Dashboard Summary --- */}
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : totalAssets > 0 ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded shadow bg-white">
              <h2 className="font-semibold">Total Assets</h2>
              <p>{totalAssets}</p>
            </div>
            <div className="p-4 border rounded shadow bg-white">
              <h2 className="font-semibold">Net Movement</h2>
              <p>{netMovement}</p>
            </div>
            <div className="p-4 border rounded shadow bg-white">
              <h2 className="font-semibold">Purchases</h2>
              <p>{purchases}</p>
            </div>
            <div className="p-4 border rounded shadow bg-white">
              <h2 className="font-semibold">Assigned</h2>
              <p>{assignedAssets}</p>
            </div>
            <div className="p-4 border rounded shadow bg-white">
              <h2 className="font-semibold">Expended</h2>
              <p>{expendedAssets}</p>
            </div>
            <div className="p-4 border rounded shadow bg-white">
              <h2 className="font-semibold">Transfers</h2>
              <p>In: {transferIn} | Out: {transferOut}</p>
            </div>
          </div>

          {/* --- Per Base/Asset Breakdown --- */}
          <div className="mt-8">
            <h2 className="font-bold text-lg mb-4">Detailed Breakdown</h2>
            <table className="min-w-full border border-gray-400 bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Base</th>
                  <th className="p-2 border">Asset</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Purchases</th>
                  <th className="p-2 border">Assigned</th>
                  <th className="p-2 border">Expended</th>
                  <th className="p-2 border">In</th>
                  <th className="p-2 border">Out</th>
                  <th className="p-2 border">Net</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.map((row, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="p-2 border">{row.base_name}</td>
                    <td className="p-2 border">{row.asset_name}</td>
                    <td className="p-2 border">{row.category}</td>
                    <td className="p-2 border">{row.purchases}</td>
                    <td className="p-2 border">{row.assigned_assets}</td>
                    <td className="p-2 border">{row.expended}</td>
                    <td className="p-2 border">{row.transaction_in}</td>
                    <td className="p-2 border">{row.transaction_out}</td>
                    <td className="p-2 border">{row.net_movement}</td>
                  </tr>
                ))}
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
