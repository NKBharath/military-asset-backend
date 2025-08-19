const bcrypt = require("bcrypt");
const db = require("../../config/db");
const jwt = require('jsonwebtoken');
const e = require("express");

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
      res.json({
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





const setAdminAssets = async (req, res) => {
  try {
    const { asset_name, equipment_type, base_id, quantity, date, action, } = req.body;

    // 1. Check if asset exists
    const assetCheckQuery = `
      SELECT * FROM assets 
      WHERE asset_name = $1 AND base_id = $2 AND category = $3
    `;
    const assetCheckValues = [asset_name, base_id, equipment_type];
    let assetResult = await pool.query(assetCheckQuery, assetCheckValues);

    let assetId;
    if (assetResult.rows.length === 0) {
      // Insert new asset
      const insertAssetQuery = `
        INSERT INTO assets (asset_name, base_id, category)
        VALUES ($1, $2, $3)
        RETURNING asset_id
      `;
      const insertAssetValues = [asset_name, base_id, equipment_type];
      const newAsset = await pool.query(insertAssetQuery, insertAssetValues);
      assetId = newAsset.rows[0].asset_id;
    } else {
      assetId = assetResult.rows[0].asset_id;
    }

    // 2. Insert into transactions
    const insertTransactionQuery = `
      INSERT INTO transactions (asset_id, action, quantity, transaction_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const insertTransactionValues = [assetId, action, quantity, date];
    const transactionResult = await pool.query(insertTransactionQuery, insertTransactionValues);

    res.status(201).json({
      success: true,
      message: "Asset & Transaction stored successfully",
      asset_id: assetId,
      transaction: transactionResult.rows[0]
    });

  } catch (error) {
    console.error("Error in setAdminAssets:", error);
    res.status(500).json({
      success: false,
      message: "Error adding asset and transaction",
      error: error.message
    });
  }
};

// controllers/transferController.js

// Transfer Asset between bases
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



module.exports = {loginAdmin, getAdminDashboard, setAdminAssets, transferAsset}