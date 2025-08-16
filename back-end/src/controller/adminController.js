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

const getAdminDashboard = async (req, res)=>{
    res.status(200).json({message: "Welcome to the Admin Dashboard"});
}

module.exports = {loginAdmin, getAdminDashboard}