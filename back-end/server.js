const express = require("express");
const cors = require("cors");
const adminRoutes = require("./src/routes/adminRoutes");
const baseCommanderRoutes = require("./src/routes/baseCommanderRoutes");
const app = express();
// const bcrypt = require('bcrypt');

// const password = 'basealpha'; 
// const saltRounds = 10;

// bcrypt.hash(password, saltRounds, (err, hash) => {
//     if(err) {
//         console.error(err);
//         return;
//     }
//     console.log("Hashed Password:", hash);
// });

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/admin", adminRoutes); 
app.use("/api/base-commander", baseCommanderRoutes);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
