const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Définir le moteur de vues EJS
app.set("view engine", "ejs");

// Importation des routes
const userRoute = require("./routes/User");
app.use("/user", userRoute);

const authRouter = require("./routes/auth");
app.use("/home", authRouter);

// Middleware pour analyser le corps des requêtes (JSON et URL-encoded)
app.use(express.json()); // Pour analyser le JSON dans les requêtes POST
app.use(express.urlencoded({ extended: true })); // Pour analyser les données de formulaire (application/x-www-form-urlencoded)

// Middleware pour servir les fichiers statiques (CSS, JS, etc.)
app.use(express.static(__dirname + "/public"));

// Démarrer le serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
