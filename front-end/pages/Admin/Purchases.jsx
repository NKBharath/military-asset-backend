import { useState } from "react";
import { addAdminAsset } from "../../controller/AdminDashboardController";

const AdminPurchases = () => {
  const assetOptions = ["Rifle A1", "Jeep X2", "Radio R5", "Truck T9", "Drone D2"];

  // Base names should match your actual table prefixes
  const baseOptions = [
    { id: "alpha", name: "Base Alpha" },
    { id: "bravo", name: "Base Bravo" },
    { id: "charlie", name: "Base Charlie" },
  ];

  const equipmentTypes = ["Vehicle", "Weapon", "Communication"];

  const [formData, setFormData] = useState({
    asset_name: "",
    base: "",              // base string (alpha/bravo/charlie)
    equipment_type: "",
    action: "purchase",    // always purchase here
    status: "available",   // default
    quantity: 1,
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addAdminAsset(formData); // backend decides table
      if (result?.success) {
        alert("Asset added successfully");
        setFormData({
          asset_name: "",
          base: "",
          equipment_type: "",
          action: "purchase",
          status: "available",
          quantity: 1,
          date: "",
        });
      } else {
        alert(result?.message || "Error adding asset");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding asset");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asset Selection */}
        <select
          name="asset_name"
          value={formData.asset_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Asset</option>
          {assetOptions.map((asset) => (
            <option key={asset} value={asset}>
              {asset}
            </option>
          ))}
        </select>

        {/* Base Selection */}
        <select
          name="base"
          value={formData.base}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Base</option>
          {baseOptions.map((base) => (
            <option key={base.id} value={base.id}>
              {base.name}
            </option>
          ))}
        </select>

        {/* Equipment Type */}
        <select
          name="equipment_type"
          value={formData.equipment_type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Type</option>
          {equipmentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Quantity */}
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          className="w-full border p-2 rounded"
          required
        />

        {/* Date */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Asset
        </button>
      </form>
    </div>
  );
};

export default AdminPurchases;
