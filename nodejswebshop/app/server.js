const express = require("express");

const app = express();
app.set("view engine", "ejs");
const userRoute = require("./routes/User");
app.use("/user", userRoute);

// Démarrage du serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
app.use(express.static(__dirname + "/public"));
