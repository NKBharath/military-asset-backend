const fs = require("fs");
const db = require("../config/db");
const path = require("path");
const schemaPath = path.resolve(__dirname,"../db/schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema, (error) => {
    if (error) {
        console.error("Error initializing database:", error);
    } else {
        console.log("Database initialized with schema");
    }
});

module.exports = {
    db
};