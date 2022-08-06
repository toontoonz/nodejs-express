const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})

// config database
const db_config = {
    host: "localhost",
    user: "root",
    pass: "",
    database: "house"
}

const conn = mysql.createConnection(db_config);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = 8000;
app.post('/home', (req, res) => {
    const name = req.body.name
    const desc = req.body.desc;
    const price = req.body.price;
    const postCode = req.body.post_code;
    const qry = `INSERT INTO house VALUES ("", "${name}", "${desc}", "${price}", "${postCode}")`;

    conn.query(qry, (err, result) => {
        if (err) throw err;
        res.json(result)
        conn.end()
    });
});

app.get('/home', (req, res) => {
    const qry = `select * from house`;
    conn.query(qry, (err, payload) => {
        if (err) throw err;
        if (payload) {
            const qryCount = `select COUNT(*) as count from house`;
            conn.query(qryCount, (err, resCount) => {
                if (err) throw err;
                res.send([{ payload }, resCount])
                conn.end()
            });
        }
    });
});

app.get('/postCode', (req, res) => {
    const qry = `select post_code from house`;
    conn.query(qry, (err, payload) => {
        if (err) throw err;
        if (payload) {
            const qryCount = `select COUNT(*) as count from house`;
            conn.query(qryCount, (err, resCount) => {
                if (err) throw err;
                res.send([{ payload }, resCount])
                conn.end()
            });
        }
    });
});

app.get('/postCode/:id', (req, res) => {
    const id = req.params.id;
    const qry = `select avg(price) as average ,price as median from house where id = ${id} order by count(1) desc limit 1`;
    conn.query(qry, (err, resultAVG) => {
        if (err) throw err;
        res.send(resultAVG)
    });
});

app.listen(PORT, () => {
    console.log(`Server online on PORT ${PORT}`);
})