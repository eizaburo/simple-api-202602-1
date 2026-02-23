
const express = require("express");
const app = express();

// CORS対応: 全ドメイン・全メソッド許可
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use(express.urlencoded({ extended: true }));

const { Pool } = require("pg");
const pool = new Pool({
    host: "localhost",
    database: "testdb",
    user: "dbuser",
    password: "postgres",
    port: 5432
});


app.get("/", (req, res) => {
    res.send("Hello Node.js");
});

app.get("/inquiries", async (req, res) => {
    try {
        const result = await pool.query('select * from inquiries;');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
    }
});

app.post("/inquiries", async (req, res) => {

    const { title, email, message } = req.body;
    // res.send(`title=${title}, email=${email}, message=${message}`);
    const result = await pool.query({
        text: 'insert into inquiries(title,email,message) values($1,$2,$3) returning *',
        values: [title, email, message],
    });

    res.send("受け付けましたよ。")

});

app.listen(3333, () => {
    console.log("Start server.");
});