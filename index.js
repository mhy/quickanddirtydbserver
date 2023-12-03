//npm init
//npm install sqlite3 --save
//npm install express --save

//node index.js

// https://github.com/fraigo/node-express-rest-api-example/tree/master/

const sqlite3 = require('sqlite3');
const express = require('express');

const app = express();
const port = 3000;

const table_name = 'laundry_items'
const column_id = 'id';
const column_info = 'info';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db = new sqlite3.Database('test_db', (err) => {
    if (err) {
        return console.error(err.message);
    } else {
        console.log('gggggg');
        db.run(`CREATE TABLE ${table_name}( \
            ${column_id} INTEGER PRIMARY KEY NOT NULL, \
            ${column_info} INTEGER NOT NULL \
            )`, (err) => {
            if (err) {
                console.log('Table already exists');
            }
        });
    }
    console.log('Connected to the in-memory SQLite DB');
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//curl -d "id=1&info=10" -X POST http://localhost:3000/add/
app.post('/add/', (req, res, next) => {
    let data = {
        id: req.body.id,
        info: req.body.info
    }
    let sql = `INSERT INTO ${table_name} (${column_id}, ${column_info}) VALUES (?,?)`;
    let params = [data.id, data.info];

    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "id": data.id,
            "info": data.info
        });
    });
});

// curl -d "id=2&info=250" -X PATCH http://localhost:3000/update/
app.patch("/update/", (req, res, next) => {
    let data = {
        id: req.body.id,
        info: req.body.info
    }
    let sql = `UPDATE ${table_name} set ${column_info} = ? WHERE ${column_id} = ?`;
    let params = [data.info, data.id];

    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ "error": res.message })
            return;
        }
        res.json({
            'message': "success",
            'data': data,
            'changes': this.changes
        });
    });
});

// http://localhost:3000/all_items/
app.get('/all_items/', (req, res, next) => {
    let sql = `SELECT * from ${table_name}`
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ 'error': err.message });
            return;
        }
        res.json({
            'message': 'success',
            'data': rows
        });
    });
});

// http://localhost:3000/item/2
app.get('/item/:id', (req, res, next) => {
    let sql = `SELECT * from ${table_name} WHERE id = ?`
    let params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ 'error': err.message });
            return;
        }
        res.json({
            'message': 'success',
            'data': row
        });
    });
});

let server = app.listen(port, () => {
    console.log(`Example listening on port ${port}`)
})

process.on('SIGINT', () => {
    console.log('Closing DB Connection.');
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the DB connection');
    });

    server.close((err) => {
        console.log('Server killed');
        process.exit(err ? 1 : 0);
    });
});

app.use((_, res) => {
    res.status(404);
})
