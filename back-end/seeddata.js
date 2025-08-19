const db = require("./config/db");
const bcrypt = require("bcrypt");
const seedDatabase = async (req, res) => {
    try {
        const {base_name, base_commander_id} = req.body;
        db.run("INSERT INTO bases (base_name, base_commander_id) VALUES (?, ?)", [base_name, base_commander_id]);
        res.status(201).json({message: "Base created successfully"});
    } catch (error) {
        console.error("Error seeding database:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

module.exports = { seedDatabase };