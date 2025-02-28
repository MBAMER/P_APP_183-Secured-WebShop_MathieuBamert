const mysql = require("mysql2/promise");
const crypto = require("crypto");
const connection = mysql.createPool({
  host: "db_container",
  user: "root",
  password: "root",
  port: 3306,
  database: "db_users",
});

const generateSalt = () => {
  return crypto.randomBytes(8).toString("hex");
};

// Fonction pour hacher le mot de passe avec un salt
const hashPassword = (password, salt) => {
  const hash = crypto.createHmac("sha256", salt);
  hash.update(password);
  return hash.digest("hex");
};

module.exports = {
  get: (req, res) => {
    res.render("login", { name: "Mathieu" });
  },

  getregister: (req, res) => {
    res.render("register", { name: "Mathieu" });
  },

  createUser: (req, res) => {
    console.log(req.body);

    try {
      // For pool initialization, see above
      const { username, password } = req.body;

      const salt = generateSalt();
      const hashedPassword = hashPassword(password, salt);
      console.log(hashedPassword);

      connection.query(
        "INSERT INTO `t_user`(`username`, `password`, `salt`) VALUES (?,?,?)",
        [username, hashedPassword, salt]
      );
      // Connection is automatically released when query resolves
    } catch (err) {
      console.log(err);
    }
    res.status(200).send("Utilisateur Créé");
  },
};
