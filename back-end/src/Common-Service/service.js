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
                const newQuantity = row.available + Number(quantity);
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

const TransferStorageTrigger = (asset_id, base_id, other_base_id, quantity, status) => {
    if(!asset_id || !base_id || !other_base_id || !quantity || !status){
        console.error("Invalid transfer storage trigger parameters");
        return;
    }
    db.get(`SELECT * FROM asset_storage WHERE asset_id = ? AND base_id = ?`,[asset_id, base_id], (error, row)=>{
        if(error) return console.error("DB Error", error);
        if(status === "transfer-out"){
            if(row){
                const SubQuantity = row.available - Number(quantity);
                db.run(`UPDATE asset_storage SET available = ? WHERE asset_id = ? AND base_id = ?`, [SubQuantity, asset_id, base_id], (error)=>{
                    if(error) return console.error("DB Error", error);
                    else return "Asset updated";
                })
                db.get(`SELECT * FROM asset_storage WHERE asset_id = ? AND base_id = ?`,[asset_id, other_base_id], (error, otherRow)=>{
                if(error) return console.error("DB Error", error);
                if(otherRow){
                    const newQuantity = otherRow.available + Number(quantity);
                    db.run(`UPDATE asset_storage SET available = ? WHERE asset_id = ? AND base_id = ?`, [newQuantity, asset_id, other_base_id], (error)=>{
                        if(error) return console.error("DB Error", error);
                        else return "Asset updated";
                    })
                } else {
                    db.run(`INSERT INTO asset_storage (asset_id, base_id, available) VALUES (?, ?, ?)`, [asset_id, other_base_id, quantity], (error)=>{
                        if(error) return console.error("DB Error", error);
                        else return "Asset updated";
                    })
                }})
            } else {
                console.error("Asset not found in base storage for transfer out");
            }
        } else if(status === "transfer-in"){
            db.get(`SELECT * FROM asset_storage WHERE asset_id = ? AND base_id = ?`,[asset_id, other_base_id], (error, otherRow)=>{
                if(error) return console.error("DB Error", error);
                if(otherRow){
                    db.get(`SELECT * FROM asset_storage WHERE asset_id = ? AND base_id = ?`, [asset_id, base_id], (error, row)=>{
                        if(error) return console.error("DB Error", error);
                        if(row){
                            const AddQuantity = row.available + Number(quantity);
                            db.run(`UPDATE asset_storage SET available = ? WHERE asset_id = ? AND base_id = ?`, [AddQuantity, asset_id, base_id], (error)=>{
                                if(error) return console.error("DB Error", error);
                                else return "Asset updated";
                            })
                        } else {
                            db.run(`INSERT INTO asset_storage (asset_id, base_id, available) VALUES (?, ?, ?)`, [asset_id, base_id, quantity], (error)=>{
                                if(error) return console.error("DB Error", error);
                                else return "Asset updated";
                            })
                        }
                    })
                    const SubQuantity = otherRow.available - Number(quantity);
                    db.run(`UPDATE asset_storage SET available = ? WHERE asset_id = ? AND base_id = ?`, [SubQuantity, asset_id, other_base_id], (error)=>{
                        if(error) return console.error("DB Error", error);
                        else return "Asset updated";
                    })
                }
            })
        }
    })
}

module.exports = { AssetStorageTrigger, TransferStorageTrigger };