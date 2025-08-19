const db = require("./config/db");
const bcrypt = require("bcrypt");
const seedDatabase = async (req, res) => {
    try {
        const {asset_name, asset_type} = req.body;
        db.run("INSERT INTO assets (asset_name, asset_type) VALUES (?, ?)", [asset_name, asset_type]);
        res.status(201).json({message: "Asset created successfully"});
    } catch (error) {
        console.error("Error seeding database:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

module.exports = { seedDatabase };