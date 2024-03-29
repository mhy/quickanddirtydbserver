//npm init
//npm install sqlite3 --save
//npm install express --save

//node index.js

// https://github.com/fraigo/node-express-rest-api-example/tree/master/

const sqlite3 = require('sqlite3');
const express = require('express');

const app = express();
const port = 8080;

const table_name = 'laundry_items'
const column_id = 'id';
const column_temp = 'temperature';
const column_spin = 'spin';
const column_count = 'count';
const column_name = 'name';
const column_path = 'path';
const column_type = 'type';
const count_initial = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db = new sqlite3.Database('test_db', (err) => {
   if (err) {
      return console.error(err.message);
   } else {
      console.log('creating table');
      db.run(`CREATE TABLE ${table_name}( \
            ${column_id} INTEGER PRIMARY KEY NOT NULL, \
            ${column_temp} INTEGER NOT NULL, \
            ${column_spin} INTEGER NOT NULL, \
            ${column_count} INTEGER NOT NULL, \
            ${column_name} VARCHAR(20), \
            ${column_type} VARCHAR(10), \
            ${column_path} VARCHAR(100)
            )`, (err) => {
         if (err) {
            console.log('Table already exists' + err.message);
         }
      });
   }
   console.log('Connected to the in-memory SQLite DB');
});

app.get('/', (req, res) => {
   res.send('Up and Running!');
});

//curl -d "id=1&temp=1&spin=1" -X POST http://localhost:8080/add/
app.post('/add/', (req, res, next) => {
   let data = {
      id: req.body.id,
      temp: req.body.temp,
      spin: req.body.spin
   }
   let sql = `INSERT INTO ${table_name} (${column_id}, ${column_temp}, ${column_spin}, ${column_count}) VALUES (?,?,?,?)`;
   let params = [data.id, data.temp, data.spin, count_initial];

   db.run(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ "error": err.message })
         return;
      }
      res.json({
         'result': 'success',
         'data': {
            'id': data.id,
            'temp': data.temp,
            'spin': data.spin,
            'count': count_initial
         }
      });
   });
});

// // curl -d "id=2&temp=250" -X PATCH http://localhost:8080/update/
// app.patch("/update/", (req, res, next) => {
//    let data = {
//       id: req.body.id,
//       temp: req.body.temp
//    }
//    let sql = `UPDATE ${table_name} set ${column_temp} = ? WHERE ${column_id} = ?`;
//    let params = [data.temp, data.id];

//    db.run(sql, params, (err, result) => {
//       if (err) {
//          res.status(400).json({ "error": res.message })
//          return;
//       }
//       res.json({
//          'result': "success",
//          'data': data,
//          'changes': this.changes
//       });
//    });
// });

// curl -d "id=2" -X PATCH http://localhost:8080/increase_count/
app.patch("/increase_count/", (req, res, next) => {
   let data = {
      id: req.body.id
   }
   let sql = `UPDATE ${table_name} set ${column_count} = ${column_count} + 1 WHERE ${column_id} = ?`;
   let params = [data.id];

   db.run(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ "error": res.message })
         return;
      }
      res.json({
         'result': "success"
      });
   });
});

// curl -d "id=2&name=ThisIsIt" -X PATCH http://localhost:8080/update_name/
app.patch("/update_name/", (req, res, next) => {
   let data = {
      id: req.body.id,
      name: req.body.name
   }
   let sql = `UPDATE ${table_name} set ${column_name} = ? WHERE ${column_id} = ?`;
   let params = [data.name, data.id];

   db.run(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ "error": res.message })
         return;
      }
      res.json({
         'result': "success"
      });
   });
});

// curl -d "id=2&path=http://this.is.test" -X PATCH http://localhost:8080/update_path/
app.patch("/update_path/", (req, res, next) => {
   let data = {
      id: req.body.id,
      path: req.body.path
   }
   let sql = `UPDATE ${table_name} set ${column_path} = ? WHERE ${column_id} = ?`;
   let params = [data.path, data.id];

   db.run(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ "error": res.message })
         return;
      }
      res.json({
         'result': "success"
      });
   });
});

// curl -d "id=2&type=pants" -X PATCH http://localhost:8080/update_type/
app.patch("/update_type/", (req, res, next) => {
   let data = {
      id: req.body.id,
      type: req.body.type
   }
   let sql = `UPDATE ${table_name} set ${column_type} = ? WHERE ${column_id} = ?`;
   let params = [data.type, data.id];

   db.run(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ "error": res.message })
         return;
      }
      res.json({
         'result': "success"
      });
   });
});


// http://localhost:8080/all_items/
app.get('/all_items/', (req, res, next) => {
   let sql = `SELECT * from ${table_name}`
   let params = []
   db.all(sql, params, (err, rows) => {
      if (err) {
         res.status(400).json({ 'error': err.message });
         return;
      }
      res.json({
         'result': 'success',
         'data': rows
      });
   });
});

// http://localhost:8080/item/2
app.get('/item/:id', (req, res, next) => {
   let sql = `SELECT * from ${table_name} WHERE id = ?`
   let params = [req.params.id];
   db.get(sql, params, (err, row) => {
      if (err) {
         res.status(400).json({ 'error': err.message });
         return;
      }
      res.json({
         'result': 'success',
         'data': row
      });
   });
});

// curl -X DELETE http://192.168.1.47:8080/delete/3
app.delete('/delete/:id', (req, res, next) => {
   let sql = `DELETE FROM ${table_name} WHERE id = ?`
   let params = [req.params.id];

   db.run(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ 'error': res.message });
         return;
      }

      res.json({
         'result': 'success'
      });
   });
})

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
