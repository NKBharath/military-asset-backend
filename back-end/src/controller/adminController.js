const bcrypt = require("bcrypt");
const db = require("../../config/db");
const jwt = require('jsonwebtoken');
const { AssetStorageTrigger } = require("../Common-Service/service");

const generatetoken = (id) =>{
    return jwt.sign({id: id, role: "admin"}, "secret123", {expiresIn: "1h"});
}

const loginAdmin = async (req, res) =>{
    try{
      const {username, password} = req.body;
      const sql = "SELECT * FROM users WHERE username = ? AND role = 'admin'";
      db.get(sql, [username], async(error, admin)=>{
        if(error){
          console.error("DB Error", error);
          return res.status(500).json({message: "Internal Server Error"});
        }
        if(!admin) return res.status(400).json({message: "No data found"});

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        const token = generatetoken(admin.user_id);
        res.status(200).json({
          success: true,
          message: "login successful",
          token: token,
          user: {
            id: admin.user_id,
            role: admin.role,
            username: admin.username,
          }
        })
      })
    }catch(error){
      console.error("Error logging in admin:", error);
      res.status(500).json({message: "Internal Server Error"});
    }
} 

const getAdminDashboard = async (req, res) => {
  try {
    const sql = "SELECT * FROM asset_storage"
    db.all(sql, async (error, result) => {
      if (error) {
        console.error("DB Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.json({
        success: true,
        data: result,
      });
    });

  } catch (error) {
    console.error("Error in getAdminDashboard:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};

const getAssetsData = async(req, res) => {
  try{
    const sql = "SELECT * FROM assets";
    db.all(sql,(error, assets)=>{
      if(error){
        console.error("DB Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.json({
        success: true,
        data: assets,
        message: "Assets Data fetched successfully"
      });
    })
  } catch(error) {
    console.error("Error in getAssetsData: backend", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching assets data backend",
      error: error.message
    });
  }
}

const getBaseData = async (req, res) => {
  try {
    const sql = "SELECT * FROM bases";
    db.all(sql, (error, bases) => {
      if (error) {
        console.error("DB Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.json({
        success: true,
        data: bases,
        message: "Bases Data fetched successfully"
      });
    });
  } catch (error) {
    console.error("Error in getBaseData:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching base data",
      error: error.message
    });
  }
}

const setAdminAssets = async (req, res) => {
  try {
    const { asset_id, base_id, quantity, status } = req.body;
    const sql = `INSERT INTO transactions (asset_id, base_id, quantity, status) VALUES (? , ?, ?, ?);`
    const params = [asset_id, base_id, quantity, status];
    db.run(sql, params, (error)=>{
      if(error){
        console.error("DB Error", error);
        return res.status(500).json({message: "Internal Server Error"});
      } else{
        AssetStorageTrigger(asset_id, base_id, quantity, status);
      }
      return res.status(201).json({message: "Asset added successfully", success: true});
    })
  }catch(error){
    console.error("Error adding asset:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding asset",
      error: error.message
    });
  }  
};

const fetchTransactions = async (req, res) =>{
  try{
    const sql = `SELECT * FROM transactions`;
    db.all(sql, (error, row)=>{
      if(error){
        console.log("DB Error", error);
        return res.status(500).json({ message: "Internal Server Error" });

      }
      res.status(200).json({
        success: true,
        data: row,
        message: "Transactions fetched successfully"
      })
    })
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message
    });
  }
}
const transferAsset = async (req, res) => {
  try {
    const { asset_id, from_base_id, to_base_id, quantity } = req.body;

    // 1. Validate available quantity from source base
    const sourceAsset = await pool.query(
      `SELECT available_quantity 
       FROM assets 
       WHERE asset_id = $1 AND base_id = $2`,
      [asset_id, from_base_id]
    );

    if (sourceAsset.rows.length === 0) {
      return res.status(404).json({ message: "Asset not found in source base" });
    }

    if (sourceAsset.rows[0].available_quantity < quantity) {
      return res.status(400).json({ message: "Insufficient available quantity for transfer" });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // 2. Deduct from source base
    await pool.query(
      `UPDATE assets 
       SET available_quantity = available_quantity - $1 
       WHERE asset_id = $2 AND base_id = $3`,
      [quantity, asset_id, from_base_id]
    );

    await pool.query(
      `INSERT INTO transactions (asset_id, action, quantity, transaction_date) 
       VALUES ($1, $2, $3, NOW())`,
      [asset_id, "transfer_out", quantity]
    );

    // 3. Add to destination base
    // Check if asset already exists in destination base
    const destAsset = await pool.query(
      `SELECT asset_id FROM assets WHERE asset_id = $1 AND base_id = $2`,
      [asset_id, to_base_id]
    );

    if (destAsset.rows.length > 0) {
      // If asset already exists in destination base → update
      await pool.query(
        `UPDATE assets 
         SET available_quantity = available_quantity + $1, total_quantity = total_quantity + $1
         WHERE asset_id = $2 AND base_id = $3`,
        [quantity, asset_id, to_base_id]
      );
    } else {
      // If not, insert new entry in assets for destination base
      await pool.query(
        `INSERT INTO assets (asset_id, base_id, asset_name, category, total_quantity, available_quantity, assigned_quantity) 
         SELECT asset_id, $2, asset_name, category, $3, $3, 0
         FROM assets WHERE asset_id = $1 AND base_id = $4`,
        [asset_id, to_base_id, quantity, from_base_id]
      );
    }

    await pool.query(
      `INSERT INTO transactions (asset_id, action, quantity, transaction_date) 
       VALUES ($1, $2, $3, NOW())`,
      [asset_id, "transfer_in", quantity]
    );

    // Commit transaction
    await pool.query("COMMIT");

    res.json({ message: "Asset transferred successfully" });

  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Error transferring asset" });
  }
};



module.exports = {loginAdmin, getAdminDashboard, getAssetsData, getBaseData, setAdminAssets, fetchTransactions, transferAsset}