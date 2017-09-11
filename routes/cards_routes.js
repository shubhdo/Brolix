const routes = require('express').Router();
const mongoose = require('mongoose');



let config=require('../file_handler/config/config_dev');
let cards_response_handler=require('../file_handler/cards_handler/cards_response_handler');

let url = config.mongo_url;

mongoose.connect(url, {
    useMongoClient: true
});


routes.get('/', (req, res) => {
    res.status(200).json("connected")
})





module.exports = routes;