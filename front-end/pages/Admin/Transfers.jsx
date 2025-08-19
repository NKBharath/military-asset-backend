import React, { useState } from "react";
import axios from "axios";
import API from "../../common/axiosInstance";
// Example asset list, you can fetch this from your backend if dynamic
const assets = [
  { asset_id: 1, asset_name: "Rifle" },
  { asset_id: 2, asset_name: "Jeep" },
  { asset_id: 3, asset_name: "Laptop" },
  { asset_id: 4, asset_name: "Rifle" },
  { asset_id: 5, asset_name: "Tank" },
  { asset_id: 7, asset_name: "Pistol" },
  { asset_id: 8, asset_name: "Truck" },
  { asset_id: 10, asset_name: "Missile" },
  { asset_id: 11, asset_name: "Jeep" },
  { asset_id: 6, asset_name: "Drone" },
  { asset_id: 9, asset_name: "Radar" },
  { asset_id: 12, asset_name: "Satellite" },
  { asset_id: 17, asset_name: "Jeep X2" },
  { asset_id: 18, asset_name: "Drone D2" },
];

const AdminTransfers = () => {
  const [assetId, setAssetId] = useState("");
  const [assetName, setAssetName] = useState("");
  const [fromBase, setFromBase] = useState("");
  const [toBase, setToBase] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const handleAssetChange = (e) => {
    const selectedAssetName = e.target.value;
    setAssetName(selectedAssetName);

    const asset = assets.find((a) => a.asset_name === selectedAssetName);
    setAssetId(asset ? asset.asset_id : "");
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/transfer", {
        asset_id: assetId,
        from_base_id: fromBase,
        to_base_id: toBase,
        quantity: parseInt(quantity),
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">Transfer Asset</h2>
      <form onSubmit={handleTransfer} className="flex flex-col gap-3">
        <select
          value={assetName}
          onChange={handleAssetChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Asset</option>
          {assets.map((asset) => (
            <option key={asset.asset_id} value={asset.asset_name}>
              {asset.asset_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Asset ID"
          value={assetId}
          readOnly
          className="p-2 border rounded bg-gray-100"
        />

        <input
          type="text"
          placeholder="From Base ID"
          value={fromBase}
          onChange={(e) => setFromBase(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="To Base ID"
          value={toBase}
          onChange={(e) => setToBase(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Transfer
        </button>
      </form>
      {message && <p className="mt-3 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default AdminTransfers;
