const bcrypt = require("bcrypt");
const db = require("../../config/db");
const jwt = require('jsonwebtoken');
const { AssetStorageTrigger, TransferStorageTrigger } = require("../Common-Service/service");

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
    let { asset_id,  date} = req.query;
    asset_id = asset_id || null;
    date = date ? `${date}%` : null;
    const base_id = req.user.id;
   db.all(`SELECT * FROM asset_storage WHERE (? is NULL OR base_id = ?) AND (? is NULL OR asset_id = ?)`, [base_id, base_id, asset_id, asset_id ], (error, result) => {
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
    let {base_id, asset_id, date} = req.query;
    base_id = base_id || null;
    asset_id = asset_id || null;
    date = date ? `${date}%` : null;
    const sql = `SELECT * FROM transactions WHERE (? is NULL OR base_id = ?) AND (? is NULL OR asset_id = ?) AND (? is NULL OR date LIKE ?) AND (status != ?)`;
    db.all(sql, [base_id, base_id, asset_id, asset_id, date, date, 'purchase'], (error, row)=>{
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

const fetchPurchaseData = async (req, res) =>{
  try{
    let {base_id, asset_id, date} = req.query;
    base_id = base_id || null;
    asset_id = asset_id || null;
    date = date ? `${date}%` : null;
    const sql = `SELECT * FROM transactions WHERE (? is NULL OR base_id = ?) AND (? is NULL OR asset_id = ?) AND (? is NULL OR date LIKE ?) AND (status = ?)`;
    db.all(sql, [base_id, base_id, asset_id, asset_id, date, date, 'purchase'], (error, row)=>{
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
    const { asset_id, base_id, other_base_id, quantity, status } = req.body;
    const sql = `INSERT INTO transactions (asset_id, base_id, other_base_id, quantity, status) VALUES (? , ?, ?, ?, ?);`
    const params = [asset_id, base_id, other_base_id, quantity, status];
    db.run(sql, params, (error)=>{
      if(error){
        console.error("DB Error", error);
        return res.status(500).json({message: "Internal Server Error"});
      } else{
        TransferStorageTrigger(asset_id, base_id, other_base_id, quantity, status);
      }
      return res.status(201).json({message: "Asset added successfully", success: true});
    })
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Error transferring asset" });
  }
};



module.exports = {loginAdmin, getAdminDashboard, getAssetsData, getBaseData, setAdminAssets, fetchTransactions, fetchPurchaseData, transferAsset}