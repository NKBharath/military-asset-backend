const { compare } = require('bcrypt');
const db = require('../../config/db');
const jwt = require('jsonwebtoken');

const generatetoken = (id) =>{
    return jwt.sign({id: id, role: "base_commander"}, "secret123", {expiresIn: "1h"});
}

const loginBaseCommander = async (req, res) =>{
    try{
      const {username, password} = req.body;
      const sql = "SELECT * FROM users WHERE username = ? AND role = 'base_commander'";
      db.get(sql, [username], async(error, user)=>{
        if(error){
          console.error("DB Error", error);
          return res.status(500).json({message: "Internal Server Error"});
        }
      })
      if(!user) return res.status(400).json({message: "No data found"});

      const isMatch = await compare(password, user.password);
      if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});
      const token = generatetoken(user.user_id);
      return res.status(200).json({
        success: true,
        message: "login successful",
        token: token,
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role
        }
      })
    }catch(error){
      console.error("Error logging in base commander:", error);
      res.status(500).json({message: "Internal Server Error"});
    }
}
const getBaseCommanderDashboard = async (req, res) => {
  try {
    const { date, equipment_type } = req.query;

    const commanderBase = req.header.base; // this comes from JWT decoded middleware
    console.log("Commander Base:", commanderBase);
    // Map commander base to the correct transactions table
    let tableName;
    switch (commanderBase) {
      case "alpha":
        tableName = "alpha_transactions";
        break;
      case "Bravo":
        tableName = "bravo_transactions";
        break;
      case "Charlie":
        tableName = "charlie_transactions";
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid base" });
    }

    // Build query dynamically
    const query = `
      SELECT *
      FROM ${tableName}
      WHERE ($1::date IS NULL OR transaction_date::date = $1::date)
        AND ($2::text IS NULL OR category = $2::text)
      ORDER BY transaction_date DESC
    `;

    const values = [date || null, equipment_type || null];
    const result = await pool.query(query, values);

    res.json({
      success: true,
      base: commanderBase,
      data: result.rows
    });

  } catch (error) {
    console.error("Error in getBaseCommanderDashboard:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message
    });
  }
};

module.exports = { loginBaseCommander, getBaseCommanderDashboard };