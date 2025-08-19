const db = require("../../config/db");

const AssetStorageTrigger = (asset_id, base_id, quantity, status) => {
    if(!asset_id || !base_id || !quantity || !status){
        console.error("Invalid asset storage trigger parameters");
        return;
    }
    db.get(`SELECT * FROM asset_storage WHERE asset_id = ? AND base_id = ?`,[asset_id, base_id], (error, row)=>{
        if(error) return console.error("DB Error", error);
        if(status === "purchase" || status === "transfer-in"){
            if(row){
                const newQuantity = row.available + quantity;
                db.run(`UPDATE asset_storage SET available = ? WHERE asset_id = ? AND base_id = ?`, [newQuantity, asset_id, base_id], (error)=>{
                    if(error) return console.error("DB Error", error);
                    else return "Asset updated";
                })
            } else {
                db.run(`INSERT INTO asset_storage (asset_id, base_id, available) VALUES (?, ?, ?)`, [asset_id, base_id, quantity], (error)=>{
                    if(error) return console.error("DB Error", error);
                    else return "Asset updated";
                })
            }
        }
    })
}

module.exports = { AssetStorageTrigger };