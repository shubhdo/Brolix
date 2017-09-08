const routes = require('express').Router();
const mongoose = require('mongoose');

const User = require('../file_handler/mongo_handler/Models/User');
const Page = require('../file_handler/mongo_handler/Models/Page');


let config=require('../file_handler/config/config_dev');
let page_response_handler=require('../file_handler/page_handler/page_response_handler');

let url = config.mongo_url;

mongoose.connect(url, {
    useMongoClient: true
});


routes.get('/', (req, res) => {
    res.status(200).json("connected")
});


routes.post('/addPage',page_response_handler.addPage );

routes.get('/getPages',page_response_handler.getPages);

routes.put('/editPage',page_response_handler.editPage);

routes.post('/blockPage',page_response_handler.blockPage);

routes.delete('/removePage',page_response_handler.removePage);

routes.get('/getPagesData',page_response_handler.getPagesData)

routes.get('/createReport',page_response_handler.createReport);


module.exports = routes;