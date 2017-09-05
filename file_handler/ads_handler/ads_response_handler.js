const mongoose = require('mongoose');

let Ads = require('../mongo_handler/Models/Advertisement');

module.exports = {
    addAds: (req, res) => {
        let ad_type = req.body.ad_type;
        let description = req.body.description;
        let limitReach = req.body.limitReach;

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

        if (winner_name !== undefined) {
            setValue.winner_name = winner_name
        }
        if (ad_type !== undefined) {
            setValue.ad_type = ad_type
        }
        if (description !== undefined) {
            setValue.description = description
        }
        if (viewed_by !== undefined) {
            setValue.viewed_by = viewed_by
        }
        if (expired !== undefined) {
            setValue.expired = expired
        }
        if (on_pages !== undefined) {
            setValue.on_pages = on_pages
        }
        if (limitReach !== undefined) {
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

        Ads.aggregate({
                $match: {_id: mongoose.Types.ObjectId(adsId)}
            },
            {$project :{limitReach:1,count:{$size: "$viewed_by"}}}
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
                   if (success.count<success.limitReach) {
                       res.status(400).send({
                           "responseCode": 400,
                           "responseMessage": "Winner not Announced",
                           "response": "Ads is not yet reached its limit"
                       });
                   }
                   else {

                   }
                }

            })
    }


}
