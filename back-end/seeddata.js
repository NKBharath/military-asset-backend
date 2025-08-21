const db = require("./config/db");

const seedDatabase = async (req, res) => {
  try {
    db.run(
      `ALTER TABLE transactions ADD COLUMN base_to_id INTEGER`,
      (err) => {
        if (err) {
          console.error("Error renaming column:", err);
          return res
            .status(500)
            .json({ message: "Failed to rename column", error: err.message });
        }
        res.status(201).json({ message: "Column renamed successfully" });
      }
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { seedDatabase };
