const { compare } = require('bcrypt');
const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const { error } = require('console');
const { AssetStorageTrigger, TransferStorageTrigger } = require('../Common-Service/service');

const generatetoken = (id) =>{
    return jwt.sign({id: id, role: "base_commander"}, "secret123", {expiresIn: "1h"});
}

const loginBaseCommander = async (req, res) =>{
    try{
      const {username, password} = req.body;
      const sql = "SELECT * FROM users WHERE username = ? AND role = 'base commander'";
      db.get(sql, [username], async(error, user)=>{
        if(error){
          console.error("DB Error", error);
          return res.status(500).json({message: "Internal Server Error"});
        }
      
      if(!user) return res.status(400).json({message: "No data found"});

      const isMatch = await compare(password, user.password);
      if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});
      
        db.get(`SELECT * FROM bases WHERE base_commander_id = ?`, [user.user_id], (error, base) => {
          if (error) {
            console.error("DB Error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
          }
          if (!base) return res.status(400).json({ message: "No base found" });
          const token = generatetoken(base.base_id);
          console.log(token)
          return res.status(200).json({
            success: true,
            message: "login successful",
            token: token,
            user: {
              id: base.base_id,
              username: user.username,
              role: user.role
            }
      })
        });
      }
      
    )
    }catch(error){
      console.error("Error logging in base commander:", error);
      res.status(500).json({message: "Internal Server Error"});
    }
}
const getBaseCommanderDashboard = async (req, res) => {
  try{
    const id= req.user.id;
    db.all(`SELECT * FROM asset_storage WHERE base_id = ?`, [id], (error, rows) => {
      if (error) {
        console.error("DB Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.json({
        success: true,
        data: rows
      });
    });
  }catch(error){
    console.error("Error in getBaseCommanderDashboard:", error);
    res.status(500).json({message: "Internal Server Error"});
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

const CommanderPurchase = async (req, res) => {
  try {
    const { asset_id,  quantity, status } = req.body;
    const base_id = req.user.id;
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
    let { asset_id, date} = req.query;
    asset_id = asset_id || null;
    date = date ? `${date}%` : null;
    const ID = req.user.id;
    const sql = `SELECT * FROM transactions WHERE (? is NULL OR base_id = ?) AND (? is NULL OR asset_id = ?) AND (? is NULL OR date LIKE ?) AND (status != ?)`;
    db.all(sql, [ ID, ID, asset_id, asset_id, date, date, 'purchase'], (error, row)=>{
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
    let {asset_id, date} = req.query;
    asset_id = asset_id || null;
    date = date ? `${date}%` : null;
    const ID = req.user.id;
    const sql = `SELECT * FROM transactions WHERE (? is NULL OR base_id = ?) AND (? is NULL OR asset_id = ?) AND (? is NULL OR date LIKE ?) AND (status = ?)`;
    db.all(sql, [ ID, ID,asset_id, asset_id, date, date, 'purchase'], (error, row)=>{
      if(error){
        console.log("DB Error", error);
        return res.status(500).json({ message: "Internal Server Error" });

      }
      console.log("Purchase Data:", row);
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
    const { asset_id,  other_base_id, quantity, status } = req.body;
    const ID = req.user.id;
    const sql = `INSERT INTO transactions (asset_id, base_id, other_base_id, quantity, status) VALUES (? , ?, ?, ?, ?);`
    const params = [asset_id, ID, other_base_id, quantity, status];
    db.run(sql, params, (error)=>{
      if(error){
        console.error("DB Error", error);
        return res.status(500).json({message: "Internal Server Error"});
      } else{
        TransferStorageTrigger(asset_id, ID, other_base_id, quantity, status);
      }
      return res.status(201).json({message: "Asset added successfully", success: true});
    })
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Error transferring asset" });
  }
};

module.exports = { loginBaseCommander, getBaseCommanderDashboard, getAssetsData, getBaseData, CommanderPurchase, fetchTransactions, fetchPurchaseData, transferAsset };