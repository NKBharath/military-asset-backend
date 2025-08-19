const sqlite3 = require("sqlite3").verbose();
const path = require("path") ;
const db_path = path.resolve(__dirname,"../db/database.sqlite")
const db = new sqlite3.Database(db_path, (error)=>{
    if(error){
        console.log("Error opening database ", error.message);
    } else{
        console.log("SQLite DB connected");
    }
});

module.exports = db;