const express = require('express')
const body_parser = require('body-parser');
const morgan=require('morgan')
const path=require('path')
let user_routes=require('./routes/user_routes');
let page_routes=require('./routes/page_routes');
let ads_routes=require('./routes/ads_routes');
let card_routes=require('./routes/cards_routes')
let common_js_files=require('./file_handler/common_files/js/js_routes');

let config=require('./file_handler/config/config_dev')
let db_status=require('./file_handler/config/config_dev')
let port = process.env.PORT || config.server_port;

const app = express();

app.use(morgan('dev'))
app.use(body_parser.json());

app.use(body_parser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'profile')));
app.use(express.static(path.join(__dirname, 'post')));
app.use(express.static(path.join(__dirname, 'assests')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});



/*

app.get('*',common_js_files.serveAngularPage)
*/


app.get('/favicon.ico', function(req, res) {
    res.status(204);
});

app.use('/',user_routes);
app.use('/',page_routes);
app.use('/',ads_routes);
/*
app.use('/',card_routes);
*/




app.listen(port, () => {
    console.log("listening on port "+port)
});


