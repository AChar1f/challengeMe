import express from "express";
import path from "path";
import { connection as db } from "./config/index.js";
import { reverse } from "dns";

const app = express();
const port = +process.env.port || 4000;
const router = express.Router();

app.use(
  router,
  express.static("./static"),
  express.json(),
  express.urlencoded({
    extended: true,
  })
);
router.get("^/$|chally", (req, res) => {
  res.status(200).sendFile(path.resolve("./static/html/index.html"));
});
router.get("/users", (req, res) => {
  try {
    const strQry = `
            select userID, username, usersurname, userAge, userEmail from Users; 
        `;
    db.query(strQry, (err, results) => {
      if (err)
        throw new Error(
          "We have run into issues while fetching the users data."
        );
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});
router.get("/user/:userID", (req, res) => {
  try {
    const strQry = `
            select userID, username, usersurname, userAge, userEmail from Users where userID = ${req.params.userID}
        `;
    db.query(strQry, (err, result) => {
      if (err) throw new Error("We ran into issues while fetching user data.");
      res.json({
        status: res.statusCode,
        result
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});
router.get('/products', (req, res) => {
    try {
        const strQry = `
        select * from Products
        `
    db.query(strQry, (err, results) => {
        if (err) throw new Error('We ran into issues while fetching products')
            res.json({
                status: res.statusCode,
                results
            })
    })
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        })
    }
})
router.get('/product/:prodID', (req, res) => {
    try {
        const strQry = `
        select * from Products where prodID = ${req.params.prodID}
        `
    db.query(strQry, (err, result) => {
        if (err) throw new Error('We ran into issues while fetching the product.')
            res.json({
                status: res.statusCode,
                result
            })
    })
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        })
    }
})
app.post('/register', (req, res) => {
    try {
        const {username, usersurname, userAge, userEmail, userPwd} = req.body
        const strQry =  `
        insert into Users(username, usersurname, userAge, userEmail, userPwd)
        values(?, ?, ?, ?, ?);
        `
    db.query(strQry, [username, usersurname, userAge, userEmail, userPwd], (err, result) => {
        if (err) throw new Error('Unable to register user.')
        res.json({
            status: res.statusCode,
            result
        })
    })
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        })
    }
})
app.delete('/user/delete/:userID', (req, res) => {
    try {
        const id = +req.params.userID
        const strQry = `
        delete from Users where userID =${id}
        `
        db.query(strQry, (err, result) => {
            if(err) throw new Error('Unable to delete User')
                res.json({
                    status: res.statusCode,
                    msg: "User deleted Successfully",
                    result
                })
        })
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        })
    }
})
app.post('/addProduct', (req, res) => {
    try {
        const {prodName, prodQuantity, prodPrice, prodURL} = req.body
        const strQry =  `
        insert into Products(prodName, prodQuantity, prodPrice, prodURL, userID)
        values(?, ?, ?, ?, ?);
        `
    db.query(strQry, [prodName, prodQuantity, prodPrice, prodURL], (err, result) => {
        if (err) throw new Error('Unable to add product.')
        res.json({
            status: res.statusCode,
            result
        })
    })
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        })
    }
})
app.delete('/product/delete/:prodID', (req, res) => {
    try {
        const id = +req.params.prodID
        const strQry = `
        delete from Products where prodID = ${id}
        `
        db.query(strQry, (err, result) => {
            if(err) throw new Error('Unable to delete Product')
                res.json({
                    status: res.statusCode,
                    msg: "Product deleted Successfully",
                    result
                })
        })
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        })
    }
})
app.listen(port, () => {
  console.log(`Ayo, We live on Port ${port}`);
});
