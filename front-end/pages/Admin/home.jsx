import { useEffect, useState } from "react";
import { getAdminDashboard, getAssetData, getBaseData } from "../../controller/AdminDashboardController";
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
        date: filters.date
      }
      const data = await getAdminDashboard(params);
      if (data?.success) {
        setDashboardData(data.data);
        setLoading(false);
      } else {
        console.error("Error fetching dashboard data:", data?.message);
      }
    }
    fetchDashboardData();
  }, [filters]);

  useEffect(()=>{
      const fetchpurchaseData = async () =>{
        const params = {
          base_id: filters.base_id,
          asset_id: filters.asset_id,
          date: filters.date
        }
        const data = await getPurchaseData(params);
        if(data?.success){
          setPurchaseData(data.data);
        } else {
          console.error("Error fetching purchases:", data?.message);
        }
      }
      fetchpurchaseData();
    }, [filters]);
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
    
   useEffect(()=>{
    const fetchTransactionData = async () =>{
      const params = {
        asset_id: filters.asset_id,
        base_id: filters.base_id,
        date: filters.date
      }
      const data = await getTransactions(params);
      if(data?.success){
        setTransactionData(data.data);
      } else {
        console.error("Error fetching transactions:", data?.message);
      }
    }
    fetchTransactionData();
  }, [filters]);

  const totalAssets = dashboardData.length;
  const purchases = purchaseData.length;
  const assignedAssets = dashboardData.reduce((sum, a) => sum + Number(a.assigned_assets || 0), 0);
  const expendedAssets = dashboardData.reduce((sum, a) => sum + Number(a.expended || 0), 0);
  const transferIn = transactionData.filter(a => a.status === "transfer-in").length;
  const transferOut = transactionData.filter(a => (a.status === "transfer-out")).length;
  const netMovement = (purchases + transferIn)-transferOut;

  return (
    <div className="p-6 space-y-6 bg-[#D7D176] h-fit ml-35">
      <div className="mt-6 bg-[#D7D176] p-4 rounded space-x-5">
          <select value={filters.base_id} className="bg-[#ffffff] p-2 font-bold rounded "
          onChange={(e)=> setFilters({...filters, base_id: e.target.value})}>
        <option value="">Select Base</option>
        {basesData?.map(base=>(
          <option key={base.base_id} value={base.base_id}>
            {base.base_name}
          </option>
        ))}
      </select>

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

          <div className="mt-8">
            <h2 className="font-bold text-lg mb-4">Detailed Breakdown</h2>
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
                  {[...(transactionData || []), ...(purchaseData || [])]
                    .sort((a, b) => a.transaction_id - b.transaction_id)
                    .map((data) => {
                      const asset_name = assetsData.find((a) => a.asset_id === data.asset_id);
                      const base_name = basesData.find((b) => b.base_id === data.base_id);
                    
                      return (
                        <tr key={data.transaction_id}>
                          <td className="border p-2">{data.transaction_id}</td>
                          <td className="border p-2">{asset_name ? asset_name.asset_name : data.asset_id}</td>
                          <td className="border p-2">{base_name ? base_name.base_name : data.base_id}</td>
                          <td className="border p-2">{data.quantity}</td>
                          <td className="border p-2">{data.status}</td>
                          <td className="border p-2">{data.date}</td>
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
