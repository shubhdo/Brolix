const mongoose = require('mongoose');
const async = require('async');
let Card = require('../mongo_handler/Models/Card');
let User = require('../mongo_handler/Models/User');
let Ads= require('../mongo_handler/Models/Advertisement')
module.exports = {
    addCard: (req, res) => {
        let price = req.body.price;
        let no_of_chances = req.body.no_of_chances;
        let card = new Card({
            price: price,
            no_of_chances: no_of_chances
        })

        card.save((error, success) => {
            if (error) {
                console.log(error);
                res.status(400).send({
                    "responseCode": 400,
                    "responseMessage": "Unsuccessful",
                    "response": error.message
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
        });

    },
    buyLuckCard: (req, res) => {
        let userId = req.body.userId;
        let cardId = req.body.cardId;


        async.waterfall([
            function (callback) {
                Card.findOne({_id: cardId}, (card_error, card_success) => {
                    if (card_error) {
                        console.log("1111111111", card_error);
                        callback(card_error)
                    }
                    else {
                        console.log("2222222222", card_success);
                        callback(null, card_success)
                    }
                })
            },
            function (card_response, callback) {
                console.log("3333333333", card_response);
                User.findOne({_id: userId}, (user_error, user_success) => {
                    if (user_error) {
                        console.log("44444444444", user_error);
                        callback(user_error)
                    }
                    else {
                        console.log("55555555555", user_success);
                        if (card_response.price > user_success.brolix) {
                            callback(new Error("Not enough brolix to buy card"))
                        }
                        else {

                            callback(null, card_response.price)
                        }
                    }
                });

            }
        ], function (finalError, finalSuccess) {
            if (finalError) {
                console.log("66666666666", finalError);
                res.status(400).send({
                    "responseCode": 400,
                    "responseMessage": "Unsuccessful",
                    "response": finalError.message
                });
            }
            else {
                console.log("7777777777", finalSuccess);
                async.parallel([
                    function (callback) {
                        Card.findOneAndUpdate({_id: cardId}, {$push: {buyers: userId}}, {new: true}, (card_update_error, card_update_success) => {

                            if (card_update_error) {
                                console.log("8888888888", card_update_error)
                                callback(card_update_error)
                            }
                            else {
                                console.log("9999999999", card_update_success);
                                callback(null, card_update_success)
                            }


                        });

                    },
                    function (callback) {
                        User.findOneAndUpdate({_id: userId}, {$inc: {brolix: -finalSuccess}}, {new: true}, (user_update_error, user_update_success) => {
                            if (user_update_error) {
                                console.log("0000000000", user_update_error)
                                callback(user_update_error)
                            }
                            else {
                                console.log("///////", user_update_success);
                                callback(null, user_update_success)
                            }

                        })
                    }
                ], (final_error, final_success) => {

                    if (final_error) {
                        console.log("@@@@@@@@@@@", final_error);
                        res.status(400).send({
                            "responseCode": 400,
                            "responseMessage": "Unsuccessful",
                            "response": final_error.message
                        });
                    }
                    else {
                        console.log("*********", final_success)
                        res.status(200).send({
                            "responseCode": 200,
                            "responseMessage": "Successful",
                            "response": final_success
                        });
                    }
                })
            }

        })

    },
    applyLuckCard:(req,res)=> {

        let adsId=req.query.adsId;
        let userId=req.query.userId;
        let cardId=req.query.cardId;

/*
        Ads.findOneAndUpdate({_id:adsId},{$set:{applied_cards:}})
*/

    }


}