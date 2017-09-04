const routes = require('express').Router();
const mongoose = require('mongoose');
const fs = require('fs');
const crypto = require('crypto');
const countries = require('country-list')();
const states = require('countryjs')
const User = require('../models/User');
const Post=require('../models/Post')
const async = require('async');
let countrydata;
let url = 'mongodb://localhost:27017/facebook';
mongoose.connect(url, {
    useMongoClient: true
});
let db = mongoose.connection;

db.on('error', function (error) {
    console.log(error);
});

db.once('open', function () {
    console.log("connected");
});


routes.get('/', (req, res) => {
    res.status(200).json("connected")
})

routes.get('/getCountries', function (req, res) {
    countrydata = countries.getData();
    res.status(200).send({
        "responseCode": 200,
        "responseMessage": "Successful",
        "response": countrydata
    });
});

routes.get('/getStates', function (req, res) {
    console.log(req.query);
    console.log(countrydata)
    let obj = (countrydata.find(x => x.name === req.query.country))
    let data = states.states(obj.code);

    res.status(200).send({
        "responseCode": 200,
        "responseMessage": "Successful",
        "response": data
    });
})


function decodeBase64Image(dataString) {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}


function responseHandler(response, err, succees) {
    if (err) {
        console.log(err);
        response.status(400).send({
            "responseCode": 400,
            "responseMessage": "Unsuccessful",
            "response": err.message
        });
    }
    else {
        console.log("**************", succees);
        response.status(200).send({
            "responseCode": 200,
            "responseMessage": "Successful",
            "response": succees
        });
    }
}


routes.post('/signup', (req, response) => {
    console.log(req.body);
    let imgbuffer = decodeBase64Image(req.body.img);
    let id = new Date().getTime() + ".jpg"
    let path = './profile/img' + id;
    fs.writeFile(path, imgbuffer.data, function (err) {
        if (err)
            console.log(err);
        else
            console.log("File successfully written");
    });
    console.log(imgbuffer)
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password
    let dob = req.body.dob;
    let country = req.body.country;
    let state = req.body.state;
    let telephone_no = req.body.contact;
    let desc = req.body.desc;
    let user = new User({
        name: name,
        email: email,
        password:password,
        address: {
            country: country,
            state: state,
        },
        telephone_no: telephone_no,
        dob: dob,
        profile: id,
        description: desc

    });

    user.save((err, succees) => {
        if (err) {
            console.log(err);
            response.status(400).send({
                "responseCode": 400,
                "responseMessage": "Unsuccessful",
                "response": err.message
            });

        }
        else {
            console.log("**************", succees);
            response.status(200).send({
                "responseCode": 200,
                "responseMessage": "Successful",
                "response": succees
            });
        }
    });
});


routes.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({email: email}, {password: 1, profile: 1,description:1,name:1}, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: "something failed"});
        }

        else {
            if (result === null) {
                res.status(404).send({error: "Email does not exist. Please register"});
            }
            else {
                if (password === result.password) {
                    console.log(result);
                    if (result.profile === undefined) {
                        result.profile = 'placeholder.jpg';
                    }

                    res.status(200).json({
                        responseCode: 200,
                        responseMessage: 'User has succesfully login',
                        result: result
                    });

                }
                else {
                    res.status(404).send({error: "Password is incorrect"});

                }

            }
        }
    })
});

routes.post('/updateStatus',(req,res)=> {
    let user_id=req.body.id;
    let desc=req.body.desc;
    let img=req.body.img;
    let imgbuffer = decodeBase64Image(req.body.img);
    let id = new Date().getTime() + ".jpg"
    let path = './post/img' + id;
    fs.writeFile(path, imgbuffer.data, function (err) {
        if (err)
            console.log(err);
        else
            console.log("File successfully written");
    });
    let post=new Post({
        created_by:user_id,
        status:desc,
        status_img:id
    });

    post.save((err, succees) => {
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


});


routes.get('/getPosts',function (req,res) {
   Post.find({created_by:req.query.user_id},(err,succees)=> {
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

});



routes.get('/getFavPosts',function (req,res) {
    Post.find({$and:[{created_by:req.query.user_id},{fav:true}]},(err,succees)=> {
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

});

routes.put('/addFavPosts',function (req,res) {


    Post.findOneAndUpdate({_id:req.body.id},{$set:{fav:req.body.fav}},{new:true},(err,succees)=> {
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

});


module.exports = routes;