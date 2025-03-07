const mysql = require("mysql2/promise");
const crypto = require("crypto");
jwt = require("jsonwebtoken");
const connection = mysql.createPool({
  host: "db_container",
  user: "root",
  password: "root",
  port: 3306,
  database: "db_users",
});

const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
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
    res.redirect("/home");
  },

  loginUser: (req, res) => {
    const { username, password } = req.body;
    connection
      .query("SELECT * FROM `t_user` WHERE `username` = ?", [username])
      .then(([rows]) => {
        if (rows.length === 0) {
          res.status(401).send("Utilisateur non trouvé");
        } else {
          const user = rows[0];
          const hashedPassword = hashPassword(password, user.salt);
          if (hashedPassword === user.password) {
            //JWT
            const token = jwt.sign(
              { username: user.username, id: user.id },
              "secret",
              { expiresIn: "1y", algorithm: "HS256" }
            );
            console.log(token);
            res.cookie("token", token, { httpOnly: true });
            res.redirect("/home");
          } else {
            res.status(401).send("Mot de passe incorrect");
          }
        }
      });
  },

  logout: (req, res) => {
    res.clearCookie("token");
    res.status(200).send("Utilisateur déconnecté");
  },
};
