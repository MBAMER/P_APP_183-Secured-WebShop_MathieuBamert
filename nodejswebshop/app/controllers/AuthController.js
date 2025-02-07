const mysql = require("mysql2/promise");

module.exports = {
  get: (req, res) => {
    res.render("login", { name: "Mathieu" });
  },

  getregister: (req, res) => {
    res.render("register", { name: "Mathieu" });
  },

  createUser: (req, res) => {
    const connection = mysql.createPool({
      host: "172.24.0.2",
      user: "root",
      password: "root",
      port: 3306,
      database: "db_users",
    });
    console.log(req.body);
    //const status = connection.connect();

    //console.log("status de la connexion : " + status);

    try {
      // For pool initialization, see above
      const username = req.body.username;
      const mail = req.body.mail;
      const password = req.body.password;

      connection.query(
        "INSERT INTO `t_user`(`user_id`,`username`, `mail`, `password`) VALUES (4,?,?,?)",
        [username, mail, password]
      );
      // Connection is automatically released when query resolves
    } catch (err) {
      console.log(err);
    }
    res.status(200).send("Utilisateur Créé");
  },
};
