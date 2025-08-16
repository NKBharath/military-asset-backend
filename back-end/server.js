const express = require("express");
const cors = require("cors");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/admin", adminRoutes); 

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
