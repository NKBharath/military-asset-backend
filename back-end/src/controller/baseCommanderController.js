const { compare } = require('bcrypt');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

const generatetoken = (id) =>{
    return jwt.sign({id: id, role: "base_commander"}, "secret123", {expiresIn: "1h"});
}

const loginBaseCommander = async (req, res) =>{
    try{
        const { username, password} = req.body;
        const result = await pool.query("SELECT * FROM base_commander WHERE username = $1", [username]);
        if(result.rows.length === 0){
            return res.status(400).json({message: "No data found"});
        }
        const baseCommander = result.rows[0];

        const isMatch = await compare(password, baseCommander.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const token = generatetoken(baseCommander.id);
        res.status(200).json({
            success: true,
            message: "login sucessfull",
            token,
            user: {
                id: baseCommander.id,
                base: baseCommander.base,
                role: "base_commander",
                username: baseCommander.username,
            }
        });
    } catch(error){
        console.error("Error logging in base commander:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}
const getBaseCommanderDashboard = async (req, res) => {
  try {
    const { date, equipment_type } = req.query;

    const query = `
      SELECT *
      FROM assets
      WHERE ($1::date IS NULL OR date::date = $1::date)
        AND (base IS NULL OR base = 'Base Alpha')
        AND ($2::text IS NULL OR equipment_type = $2::text)
    `;

    const values = [
      date || null,
      equipment_type || null
    ];

    const result = await pool.query(query, values);

    res.json({
      success: true,
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