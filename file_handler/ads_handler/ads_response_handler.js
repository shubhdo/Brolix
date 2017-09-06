const mongoose = require('mongoose');

let Ads = require('../mongo_handler/Models/Advertisement');
let User = require('../mongo_handler/Models/User')
let common_js_functions = require('../common_files/js/js_functions')

module.exports = {
    addAds: (req, res) => {

        console.log(req.body.limitReach)
        let ad_type = req.body.ad_type;
        let description = req.body.description;
        let limitReach = req.body.limitReach;

        if (ad_type===undefined||!['Cash','Coupon'].includes(ad_type)) {
            common_js_functions.responseHandler(req,res,"Please enter the ad type Cash or Coupon")
            return;
        }
        if (description===undefined||!/^[A-Za-z0-9% ]{2,}$/.test(description)) {
            common_js_functions.responseHandler(req,res,"Please enter description greater than 2 characters only");
            return;

        }
        if (limitReach===undefined||limitReach<0) {
            common_js_functions.responseHandler(req,res,"Please enter reach limit of ad");
            return;
        }
        ads = new Ads({
            ad_type: ad_type,
            description: description,
            limitReach: limitReach
        });
        ads.save((err, succees) => {
            if (err) {
                console.log(err);
                res.status(400).send({
                    "responseCode": 400,
                    "responseMessage": "Unsuccessful",
                    "response": err.message
                });

            }
            else {
                console.log("**************", succees);
                res.status(200).send({
                    "responseCode": 200,
                    "responseMessage": "Successful",
                    "response": succees
                });
            }
        });
    },
    editAds: (req, res) => {

        let adsIdCriteria = req.body.adsId;
        let description = req.body.description;
        let ad_type = req.body.ad_type;
        let winner_name = req.body.winner_name;
        let viewed_by = req.body.viewed_by;
        let expired = req.body.expired;
        let on_pages = req.body.on_pages;
        let limitReach = req.body.limitReach;

        let setValue = {};

        if (winner_name !== undefined&&/^[a-zA-Z][a-zA-Z ]+$/.test(winner_name)) {
            setValue.winner_name = winner_name
        }
        if (ad_type !== undefined&&['Cash','Coupon'].includes(ad_type)) {
            setValue.ad_type = ad_type
        }
        if (description !== undefined&&/^[A-Za-z0-9% ]{2,}$/.test(description)) {
            setValue.description = description
        }
        if (viewed_by !== undefined) {
            setValue.viewed_by = viewed_by
        }
        if (expired !== undefined&&[true,false].includes(expired)) {
            setValue.expired = expired
        }
        if (on_pages !== undefined) {
            setValue.on_pages = on_pages
        }
        if (limitReach !== undefined&&limitReach<0) {
            setValue.limitReach = limitReach
        }
        console.log(setValue)
        Ads.findOneAndUpdate({_id: adsIdCriteria}, {$set: setValue}, {new: true}, (err, succees) => {
            if (err) {
                console.log(err);
                res.status(400).send({
                    "responseCode": 400,
                    "responseMessage": "Unsuccessful",
                    "response": err.message
                });

            }
            else {
                console.log("**************", succees);
                res.status(200).send({
                    "responseCode": 200,
                    "responseMessage": "Successful",
                    "response": succees
                });
            }
        })

    },
    removeAds: (req, res) => {


        let adsIdCriteria = req.body.adsId;

        if (adsIdCriteria===undefined||mongoose.Types.ObjectId(adsIdCriteria)) {
            common_js_functions.responseHandler(req,res,"Please enter valid page Id to delete ads")
            return;
        }
        Ads.findOneAndUpdate({_id: adsIdCriteria}, {$set: {status_active: false}}, {new: true}, (err, success) => {
            if (err) {
                console.log(err);
                res.status(400).send({
                    "responseCode": 400,
                    "responseMessage": "Unsuccessful",
                    "response": err.message
                });

            }
            else {
                console.log("**************", success);
                res.status(200).send({
                    "responseCode": 200,
                    "responseMessage": "Successful",
                    "response": success
                });
            }
        })

    },
    createReport: (req, res) => {

    },
    getWinner: (req, res) => {
        let adsId = req.query.id;

        if (adsId===undefined||mongoose.Types.ObjectId(adsId)) {
            common_js_functions.responseHandler(req,res,"Please enter valid page Id to get winner")
            return;
        }
        Ads.aggregate({
                $match: {_id: mongoose.Types.ObjectId(adsId)}
            },
            {$project: {limitReach: 1, viewed_by: 1, count: {$size: "$viewed_by"}}}
            , (err, success) => {
                if (err) {
                    console.log(err);
                    res.status(400).send({
                        "responseCode": 400,
                        "responseMessage": "Unsuccessful",
                        "response": err.message
                    });

                }
                else {

                    console.log("**************", success);
                    /* res.status(200).send({
                         "responseCode": 200,
                         "responseMessage": "Successful",
                         "response": success
                     });*/
                    if (success[0].count < success[0].limitReach) {
                        res.status(400).send({
                            "responseCode": 400,
                            "responseMessage": "Winner not Announced",
                            "response": "Ads is not yet reached its limit"
                        });
                    }
                    else {
                        console.log(common_js_functions.randomNo(1, Number(success[0].count)))
                        let Winner = success[0].viewed_by[common_js_functions.randomNo(0, Number(success[0].count))];
                        console.log(Winner)
                        User.findOne({_id: Winner}, (error, result) => {
                            if (error) {
                                console.log(error);
                                res.status(400).send({
                                    "responseCode": 400,
                                    "responseMessage": "Unsuccessful",
                                    "response": error.message
                                });

                            }
                            else {

                                console.log("**************", result);
                                res.status(200).send({
                                    "responseCode": 200,
                                    "responseMessage": "Winner is Announced",
                                    "response": result
                                });
                            }
                        })
                    }
                }

            })
    }


}
