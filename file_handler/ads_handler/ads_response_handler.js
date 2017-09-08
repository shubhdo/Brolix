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
        let winnerLimit = req.body.winnerLimit;

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
        if (winnerLimit === undefined || winnerLimit > limitReach) {
            common_js_functions.responseHandler(req, res, "Winners should be less than user limits");
            return;
        }

        ads = new Ads({
            ad_type: ad_type,
            description: description,
            limitReach: limitReach,
            winner_limit: winnerLimit
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

        console.log("333333333333333",req.body);

        let adsIdCriteria = req.body._id;

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

    getAdsData: (req, res) => {

        let active=req.query.active;
        let expired=req.query.expired;


        if (active==1) {
            Ads.aggregate(
                {
                    $match: {
                        expired: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: {$sum: 1}

                    }
                }, (err, success) => {
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
                }
            )

        }
        else if(expired==1) {
            Ads.aggregate(
                {
                    $match: {
                        expired: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: {$sum: 1}

                    }
                }, (err, success) => {
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
                }
            )
        }
            else
            {


                Ads.aggregate({
                    $group: {
                        _id: null,
                        count: {$sum: 1}

                    }
                }, (err, success) => {
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
            }

    },
    getAds:(req,res)=> {
        Ads.find({},(err,success)=> {
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

    getWinnersData:
        (req, res) => {

            let cash = req.query.cash;
            let coupon = req.query.coupon;

            if (cash == 1) {
                Ads.aggregate({
                    $match: {
                        ad_type: "Cash"
                    }
                }, {
                    $project: {
                        winners: {$size: "$winner_ids"}
                    }
                }, {
                    $group: {
                        _id: null,
                        count: {$sum: "$winners"}

                    }
                }, (err, success) => {
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
            }
            else if (coupon == 1) {
                Ads.aggregate({
                    $match: {
                        ad_type: "Coupon"
                    }
                }, {
                    $project: {
                        winners: {$size: "$winner_ids"}
                    }
                }, {
                    $group: {
                        _id: null,
                        count: {$sum: "$winners"}

                    }
                }, (err, success) => {
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
            }
            else {
                Ads.aggregate({
                    $project: {
                        winners: {$size: "$winner_ids"}
                    }
                }, {
                    $group: {
                        _id: null,
                        count: {$sum: "$winners"}

                    }
                }, (err, success) => {
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
            }


        },
    addViewed:
        (req, res) => {

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
                            "responseMessage": "Ad Id not found",
                            "response": null
                        });
                    }
                    else {
                        if (resu.expired) {
                            res.status(400).send({
                                "responseCode": 400,
                                "responseMessage": "Ad expired",
                                "response": "Winner is already announced"
                            });
                            return
                        }
                        if (resu.limitReach === resu.viewed_by.length) {
                            let winnerArr = common_js_functions.randomNo(0, Number(resu.limitReach), Number(resu.winner_limit));
                            console.log("2222222222222", winnerArr);
                            let winnerArrIds = winnerArr.map(x => {
                                return resu.viewed_by[x];
                            });
                            console.log("************", winnerArrIds);
                            async.series([
                                function (callback) {
                                    Ads.findOneAndUpdate({_id: adsIdCriteria}, {
                                        $set: {
                                            winner_ids: winnerArrIds,
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
                                    User.find({_id: {$in: winnerArrIds}}, (error, result) => {
                                        if (error) {
                                            console.log("55555555555", error);
                                            callback(err);

                                        }
                                        else {
                                            console.log("66666666666", result);
                                            callback(null, result);
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
                            return;
                        }
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


        }


}
;
