const routes = require('express').Router();
const mongoose = require('mongoose');

const User = require('../file_handler/mongo_handler/Models/User');
let config=require('../file_handler/config/config_dev');
let user_response_handler=require('../file_handler/user_handler/user_response_handler');
let common_js_files=require('../file_handler/common_files/js/js_routes');

let url = config.mongo_url;

mongoose.connect(url, {
    useMongoClient: true
});


routes.get('/', (req, res) => {
    res.status(200).json("connected")
})

routes.get('/getCountries',common_js_files.getCountries );

routes.get('/getStates', common_js_files.getStates);

routes.post('/addUser',user_response_handler.addUser );

routes.put('/editUser',user_response_handler.editUser);

routes.post('/blockUser',user_response_handler.blockUser);

routes.get('/getUsers',user_response_handler.getUsers);

routes.get('/createReport',user_response_handler.createReport);


module.exports = routes;