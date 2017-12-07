const db = require('../db/dbConfig');

const userController = {

  //ADD NEW USERS
  addUser(req, res) {

    let addUser = `INSERT INTO "Users" ("username", "password", "first_name", "last_name", "email") VALUES ('${req.body.username}','${req.body.password}','${req.body.first_name}','${req.body.last_name}','${req.body.email}');`

    db.connect()
      .then(obj => {
        db.query(addUser)
          .then((resp) => {
            console.log('user created')
            res.status(200).send(resp);
          })
          .catch((err) => res.status(404).send(err));
      })
      .catch(err => {
        console.log('error connecting')
        res.status(404).send(err);
      });
  },

  //GET ALL USERS
  allUsers(req, res) {
    db.connect()
      .then(obj => {
        console.log('db connected');
        db.query('SELECT * FROM "Users"')
          .then((resp) => {
            console.log(resp);
            res.status(200).send(resp);
          })
          .catch((err) => res.status(404).send(err));
      })
      .catch(err => {
        console.log('error connecting')
        res.status(404).send(err);
      });
  },

  //LOGIN
  login(req, res, next) {
    const user = req.body.user;
    const pw = req.body.pw;
    //connect to data base
    db.connect()
      .then(obj => {
        db.query(`SELECT * FROM "Users" WHERE "username" = '${user}' AND "password" = '${pw}'`)
          .then((resp) => {
            console.log(resp);
            if (resp[0].username) {
              res.redirect('/');
            } else {
              res.redirect('/login');
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(404).send(err);
          });
      })
      .catch(err => res.status(404).send(err))
  },

  logout(req, res) {
  },

  //FORGOT PASSWORD
  forgotpw(req, res, next) {
    //enter username and email 
    const user = req.body.user;
    const email = req.body.email;
    //connect to db
    db.connect()
      .then(obj => {
        db.query(`SELECT "email" FROM "Users" WHERE "username" = '${user}' AND "email" = '${email}'`)
          .then(resp => {
            console.log(resp.length)
            if (resp.length === 0) {
              res.send('if your account is active, please check your inbox for instructions');
            } else {
              res.send('if your account is active, please check your inbox for instructions');
              next();
            }
          })
          .catch((err) => console.log(err));
      })
      .catch(err => res.status(404).send(err))
  },

  //FORGOT PASSWORD
  updatepw(req, res) {
    const user = req.body.user;
    const pw = req.body.pw;
    db.connect()
      .then(obj => {
        db.query(`UPDATE "Users" SET "password" = '${pw}' WHERE "username" = '${user}'`)
          .then(resp => res.status(200).send('password changed successful'))
          .catch(err => res.send(err))
      })
      .catch(err => res.status(404).send(err))
  }
};


module.exports = userController;