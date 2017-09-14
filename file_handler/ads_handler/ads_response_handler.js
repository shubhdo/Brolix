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

        console.log("333333333333333", req.body);

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
    applyCard: (req, res) => {
        let cardId = req.body.cardId;
        let userId = req.body.userId;
        let adsId = req.body.adsId;

        User.aggregate(
            {
                $match: {
                    _id: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $unwind: "$luckCard"

            },
            {
                $match: {
                    "luckCard._id": mongoose.Types.ObjectId(cardId)
                }
            }
            , (final_error, final_response) => {


                if(final_response[0].luckCard.status_active) {

                    let setVal={
                        no_of_chances:final_response[0].luckCard.no_of_chances,
                        by:userId
                    }
                    Ads.findOneAndUpdate({_id:adsId},{$push:{appliedCards:setVal}},{new:true},(ads_update_error,ads_update_success)=> {
                        if (ads_update_error) {
                            console.log(ads_update_error);
                            res.status(400).send({
                                "responseCode": 400,
                                "responseMessage": "Unsuccessful",
                                "response": ads_update_error.message
                            });

                        }
                        else {

                            console.log("**************", ads_update_success);

                            User.findOneAndUpdate({"luckCard._id":cardId},{$set:{"luckCard.$.status_active":false}},(user_update_error,user_update_success)=> {
                                if (user_update_error) {
                                    console.log(user_update_error);
                                    res.status(400).send({
                                        "responseCode": 400,
                                        "responseMessage": "Unsuccessful",
                                        "response":user_update_error.message
                                    })
                                }
                                else {
                                    res.status(200).send({
                                        "responseCode": 200,
                                        "responseMessage": "Luck card is applied",
                                        "response":ads_update_success
                                    });
                                }
                            })

                        }
                    })
                }
                else {
                    res.status(400).send({
                        "responseCode": 400,
                        "responseMessage": "Card is already applied",
                        "response": null
                    });
                }
            }
        )


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

        let active = req.query.active;
        let expired = req.query.expired;


        if (active == 1) {
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
        else if (expired == 1) {
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
        else {


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
    getAds: (req, res) => {

        let expired = req.query.expired;
        let active = req.query.active;
        if (active == 1) {
            Ads.find({expired: false}, (err, success) => {
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
        else if (expired == 1) {
            Ads.find({expired: true}, (err, success) => {
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
            Ads.find({}, (err, success) => {
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
                        if (resu.limitReach-1 === resu.viewed_by.length) {

                            let weightedArray=resu.viewed_by;

                            console.log("weightedArray===>",weightedArray)
                            console.log("resu.viewedby===>",resu.viewed_by)

                            console.log("resu.appliedby===>",resu.appliedCards)


                            for (let i=0;i<resu.appliedCards.length;i++) {
                                console.log("called")
                                for (let j=0;j<resu.appliedCards[i].no_of_chances;j++)
                                {
                                    console.log("all element iterated");
                                    weightedArray.push(resu.appliedCards[i].by);
                                }

                            }
                            console.log("weighted Array",weightedArray)


                            let winnerArr = common_js_functions.randomNo(0, Number(resu.winner_limit),weightedArray);

                            console.log("************", winnerArr);
                            async.series([
                                function (callback) {
                                    Ads.findOneAndUpdate({_id: adsIdCriteria}, {
                                        $set: {
                                            winner_ids: winnerArr,
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
                                    User.find({_id: {$in: winnerArr}}, (error, result) => {
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
