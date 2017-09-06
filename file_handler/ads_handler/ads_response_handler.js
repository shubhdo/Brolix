const mongoose = require('mongoose');
const async = require('async')
let Ads = require('../mongo_handler/Models/Advertisement');
let User = require('../mongo_handler/Models/User')
let common_js_functions = require('../common_files/js/js_functions')

module.exports = {
    addAds: (req, res) => {

        let ad_type = req.body.ad_type;
        let description = req.body.description;
        let limitReach = req.body.limitReach;
        let winnerLimit=req.body.winnerLimit;

        if (ad_type === undefined || !['Cash', 'Coupon'].includes(ad_type)) {
            common_js_functions.responseHandler(req, res, "Please enter the ad type Cash or Coupon")
            return;
        }
        if (description === undefined || !/^[A-Za-z0-9% ]{2,}$/.test(description)) {
            common_js_functions.responseHandler(req, res, "Please enter description greater than 2 characters only");
            return;

        }
        if (limitReach === undefined || limitReach < 0) {
            common_js_functions.responseHandler(req, res, "Please enter reach limit of ad");
            return;
        }
        if (winnerLimit === undefined || winnerLimit < limitReach) {
            common_js_functions.responseHandler(req, res, "Winners should be less than user add limits");
            return;
        }

        ads = new Ads({
            ad_type: ad_type,
            description: description,
            limitReach: limitReach,
            winner_limit:winnerLimit
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

        if (adsIdCriteria === undefined || !mongoose.Types.ObjectId(adsIdCriteria)) {
            common_js_functions.responseHandler(req, res, "Please enter valid ad Id to edit your add")
            return;
        }

        let description = req.body.description;
        let ad_type = req.body.ad_type;

        let setValue = {};

        if (ad_type !== undefined && ['Cash', 'Coupon'].includes(ad_type)) {
            setValue.ad_type = ad_type
        }
        if (description !== undefined && /^[A-Za-z0-9% ]{2,}$/.test(description)) {
            setValue.description = description
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

        if (adsIdCriteria === undefined || mongoose.Types.ObjectId(adsIdCriteria)) {
            common_js_functions.responseHandler(req, res, "Please enter valid page Id to delete ads")
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
    addViewed: (req, res) => {

        let adsIdCriteria = req.body.adsId;
        let userId = req.body.userId;
        if (adsIdCriteria === undefined || !mongoose.Types.ObjectId(adsIdCriteria)) {
            common_js_functions.responseHandler(req, res, "Please enter valid ad Id")
            return;
        }

        if (userId === undefined || !mongoose.Types.ObjectId(userId)) {
            common_js_functions.responseHandler(req, res, "Please enter valid user Id")
            return;
        }


        Ads.findOne({_id: adsIdCriteria}, (err, resu) => {

            if (err) {
                console.log(err);
                res.status(400).send({
                    "responseCode": 400,
                    "responseMessage": "Unsuccessful",
                    "response": err.message
                });

            }
            else {
                console.log("**************", resu);
                if (resu === null) {
                    res.status(404).send({
                        "responseCode": 404,
                        "responseMessage": "User Id not found",
                        "response": null
                    });
                }
                else {
                    let viewed_users = resu.viewed_by;
                    console.log("111111111", viewed_users);
                    console.log("222222222", userId);
                    console.log("333333333", viewed_users.includes(userId))

                    for (let x of viewed_users) {
                        if (String(x) === userId) {
                            res.status(400).send({
                                "responseCode": 400,
                                "responseMessage": "User has already viewed this add",
                                "response": null
                            });
                            return;
                        }

                    }

                    Ads.findOneAndUpdate({_id: adsIdCriteria}, {$push: {viewed_by: userId}}, {new: true}, (err, success) => {
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
                                "responseMessage": "Ad is viewed",
                                "response": success
                            });
                        }
                    })

                }
            }


        });


    },

    getWinner: (req, res) => {
        let adsId = req.query.id;

        if (adsId === undefined || !mongoose.Types.ObjectId.isValid(adsId)) {
            common_js_functions.responseHandler(req, res, "Please enter valid page Id to get winner")
            return;
        }

        Ads.aggregate({
                $match: {_id: mongoose.Types.ObjectId(adsId)}
            },
            {$project: {limitReach: 1, viewed_by: 1, expired: 1, count: {$size: "$viewed_by"}}}
            , (err, success) => {
                if (err) {
                    console.log("11111111111111", err);
                    res.status(400).send({
                        "responseCode": 400,
                        "responseMessage": "Unsuccessful",
                        "response": err.message
                    });

                }
                else {

                    console.log("0000000000000", success);

                    if (success[0] === undefined) {
                        res.status(404).send({
                            "responseCode": 404,
                            "responseMessage": "Ad Id Not  Found",
                            "response": null
                        });
                    }
                    else {
                        if (success[0].expired) {
                            res.status(400).send({
                                "responseCode": 400,
                                "responseMessage": "Ad expired",
                                "response": "Winner is already announced"
                            });
                            return
                        }

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
                            console.log("2222222222222", Winner)
                            async.series([
                                function (callback) {
                                    Ads.findOneAndUpdate({_id: adsId}, {
                                        $set: {
                                            winner_id: Winner,
                                            expired: true
                                        }
                                    }, {new: true}, (err, resu) => {
                                        if (err) {
                                            console.log("3333333333333", err);
                                            callback(err);
                                        }
                                        else {
                                            console.log("4444444444444", resu);
                                            callback(null, resu);
                                        }

                                    });

                                },
                                function (callback) {
                                    User.findOne({_id: Winner}, (error, result) => {
                                        if (error) {
                                            console.log("55555555555", error);
                                            callback(err);

                                        }
                                        else {
                                            console.log("66666666666", result);
                                            callback(null, result);
                                            /*res.status(200).send({
                                                "responseCode": 200,
                                                "responseMessage": "Winner is Announced",
                                                "response": result
                                            });*/
                                        }
                                    })
                                }
                            ], (finalError, finalResponse) => {
                                if (finalError) {
                                    console.log("77777777777", finalError)
                                    res.status(400).send({
                                        "responseCode": 400,
                                        "responseMessage": "Unsuccessful",
                                        "response": finalError.message
                                    });
                                }
                                else {
                                    console.log("88888888888", finalResponse)
                                    res.status(200).send({
                                        "responseCode": 200,
                                        "responseMessage": "Winner is announced",
                                        "response": finalResponse
                                    });
                                }
                            });


                        }
                    }
                }
            })
    }


}
