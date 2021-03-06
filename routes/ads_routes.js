const routes = require('express').Router();
const mongoose = require('mongoose');

const User = require('../file_handler/mongo_handler/Models/Advertisement');
const Page = require('../file_handler/mongo_handler/Models/Page');


let config=require('../file_handler/config/config_dev');
let ads_response_handler=require('../file_handler/ads_handler/ads_response_handler');

let url = config.mongo_url;

mongoose.connect(url, {
    useMongoClient: true
});


routes.get('/', (req, res) => {
    res.status(200).json("connected")
})


routes.post('/addAds',ads_response_handler.addAds );

routes.put('/editAds',ads_response_handler.editAds);

routes.get('/getAds',ads_response_handler.getAds);

routes.delete('/removePage',ads_response_handler.removeAds);

routes.get('/createReport',ads_response_handler.createReport);

routes.post('/addViewed',ads_response_handler.addViewed);

routes.get('/getWinnersData',ads_response_handler.getWinnersData);

routes.get('/getAdsData',ads_response_handler.getAdsData);

routes.post('/applyCard',ads_response_handler.applyCard)

module.exports = routes;