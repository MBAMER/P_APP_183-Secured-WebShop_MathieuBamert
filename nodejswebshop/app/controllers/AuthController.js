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

  displayHome: (req, res) => {
    res.render("home", { name: "Mathieu" });
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
            res.cookie("auth_token", token, {
              httpOnly: true, // Empêche l'accès par JavaScript côté client
              secure: true, // Active uniquement en HTTPS
              sameSite: "Strict", // Empêche les attaques CSRF
              maxAge: 3600000, // Expire après 1h (3600000 ms)
            });
            res.redirect("/home");
          } else {
            res.status(401).send("Mot de passe incorrect");
          }
        }
      });
  },

  verifyToken: async (req, res, next) => {
    console.log("Mathieu");
    const cookieTocken = req.cookies?.auth_token ?? null;
    if (cookieTocken) {
      try {
        console.log("Mathieu1");
        const decoded = jwt.verify(cookieTocken, "secret");
        console.log("Mathieu2");
      } catch (error) {
        console.log({ message: "Tocken pas valable" + error });
        return res.redirect("/login");
      }
    } else {
      return res.redirect("/home");
    }
    next();
  },

  logout: (req, res) => {
    res.clearCookie("token");
    res.status(200).send("Utilisateur déconnecté");
  },
};
