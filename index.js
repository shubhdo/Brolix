const express = require('express')
const body_parser = require('body-parser');
const path=require('path')
let routes=require('./js/routes');


let port = process.env.PORT || 3000;

const app = express();

app.use(body_parser.json());

app.use(body_parser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'profile')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});


app.use('/',routes);
app.listen(port, () => {
    console.log("listening on port "+port)
});


