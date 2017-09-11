const mongoose = require('mongoose');
const async=require('async');
let Card=require('../mongo_handler/Models/Card');
let User=require('../mongo_handler/Models/User');

module.exports={
    addCard:(req,res)=> {
         let price=req.body.price;
         let no_of_chances=req.body.no_of_chances;
         let card=new Card({
             price:price,
             no_of_chances:no_of_chances
         })

        card.save((error,success)=> {
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
    buyLuckCard:(req,res)=> {
        let userId=req.body.userId;
        let cardId=req.body.cardId;


        async.waterfall([
            function (callback) {
            Card.findOne({_id:cardId},(card_error,card_success)=> {
                if (card_error) {
                    console.log(card_error);
                    callback(card_error)
                }
                else {
                    console.log(card_success);
                    callback(null,card_success)
                }
            })
            },
            function (card_response,callback) {
            User.findOne({_id:userId},(user_error,user_success)=> {
                if (user_error) {
                    console.log(user_error);
                    callback(user_error)
                }
                else {
                    console.log(user_success);
                    if (card_response.price>user_success.brolix) {
                        callback("Not enough brolix to buy card")
                    }
                    else {

                    callback(null,user_success)
                }}
            });

            }
        ])
        Card.findOneAndUpdate({_id:cardId},{$push:{buyers:userId}},{new:true},(error,success)=> {

        });

    }



}