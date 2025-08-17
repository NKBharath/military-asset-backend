const bcrypt = require("bcrypt");
const pool = require("../config/database");
const jwt = require('jsonwebtoken');

const generatetoken = (id) =>{
    return jwt.sign({id: id, role: "admin"}, "secret123", {expiresIn: "1h"});
}

const loginAdmin = async (req, res) =>{
    try{
        const { username, password} = req.body;
        const result = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
        if(result.rows.length === 0){
            return res.status(400).json({message: "No data found"});
        }
        const admin = result.rows[0];

        //const isMatch = await compare(password, admin.password);
        if(password !== admin.password){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const token = generatetoken(admin.id);
        res.status(200).json({
            success: true,
            message: "login sucessfull",
            token,
            user: {
                id: admin.id,
                role: "admin",
                username: admin.username,
            }
        });
    } catch(error){
        console.error("Error logging in admin:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
} 


const getAdminDashboard = async (req, res) => {
  try {
    const { date, base, equipment_type } = req.query;
    
    const query = `
      SELECT *
      FROM assets
      WHERE ($1::date IS NULL OR date::date = $1::date)
        AND ($2::text IS NULL OR base = $2::text)
        AND ($3::text IS NULL OR equipment_type = $3::text)
    `;

    const values = [
      date || null,
      base || null,
      equipment_type || null
    ];

    const result = await pool.query(query, values);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("Error in getAdminDashboard:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message
    });
  }
};

module.exports = {loginAdmin, getAdminDashboard}