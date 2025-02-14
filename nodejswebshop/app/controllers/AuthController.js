const mysql = require("mysql2/promise");
const connection = mysql.createPool({
  host: "db_container",
  user: "root",
  password: "root",
  port: 3306,
  database: "db_users",
});
module.exports = {
  get: (req, res) => {
    res.render("login", { name: "Mathieu" });
  },

  getregister: (req, res) => {
    res.render("register", { name: "Mathieu" });
  },

  createUser: (req, res) => {
    console.log(req.body);
    //const status = connection.connect();

    //console.log("status de la connexion : " + status);

    try {
      // For pool initialization, see above
      const { username, password } = req.body;

      connection.query(
        "INSERT INTO `t_user`(`username`, `password`) VALUES (?,?)",
        [username, password]
      );
      // Connection is automatically released when query resolves
    } catch (err) {
      console.log(err);
    }
    res.status(200).send("Utilisateur Créé");
  },
};
