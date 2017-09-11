let User = require('../mongo_handler/Models/User');
let Admin = require('../mongo_handler/Models/Admin');
let config = require('../config/config_dev');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let common_js_functions = require('../common_files/js/js_functions')

module.exports = {
    addUser: (req, response) => {
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let dob = req.body.dob;
        let country = req.body.country;
        let state = req.body.state;
        let telephone_no = req.body.telephone_no;
        let gender = req.body.gender;

        console.log("6666666666", req.body);

        if (firstname === undefined || !/^[A-Za-z]{2,20}$/.test(firstname)) {
            common_js_functions.responseHandler(req, response, "Please enter first name between 3-30 characters only")
            return;
        }
        if (lastname === undefined || !/^[A-Za-z]{2,20}$/.test(lastname)) {
            common_js_functions.responseHandler(req, response, "Please enter last name between 3-30 characters only")
            return;

        }
        if (email === undefined || !/\S+@\S+\.\S+/.test(email)) {
            common_js_functions.responseHandler(req, response, "Please enter valid email including @ symbol")
            return;

        }
        if (dob === undefined || !common_js_functions.dateValidation(dob)) {
            common_js_functions.responseHandler(req, response, "Age range should be between 18-60")
            return;
        }
        if (telephone_no === undefined || !/^[0-9]{10,14}$/.test(telephone_no)) {
            common_js_functions.responseHandler(req, response, "Please enter 10-14 digits ")
            return;
        }
        if (gender === undefined || !['male', 'female'].includes(gender)) {
            common_js_functions.responseHandler(req, response, "Please select your gender male or female")
            return;
        }


        let user = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            address: {
                country: country,
                state: state,
            },
            telephone_no: telephone_no,
            dob: dob,
            gender: gender
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
    },
    login: (req, res) => {

        let email = req.body.email;
        let password = req.body.password;

        Admin.findOne({}, (error, success) => {
            if (error) {
                console.log(error)
                res.status(500).send({response: "something failed"});

            }
            else {
                if (success === null) {

                    bcrypt.hash(config.auto_gen_password, config.saltRounds, (err, hash) => {
                        if (err) {
                            console.log(err);

                        }
                        else {
                            console.log(hash)
                            let admin = new Admin({
                                email: config.auto_gen_email,
                                password: hash
                            });
                            admin.save(function (err, succ) {
                                if (err) {
                                    console.log(err)
                                    res.status(500).send({response: "something failed"});

                                }
                                else {
                                    console.log(succ);
                                    res.status(200).json({
                                        responseCode: 200,
                                        responseMessage: 'User Created',
                                        result: succ
                                    });


                                }
                            })

                        }
                    })

                }
                else {
                    Admin.findOne({email: email}, {password: 1, name: 1, telephone_no: 1}, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({error: "something failed"});
                        }

                        else {
                            if (result === null) {
                                res.status(404).send({error: "Email does not exist. Please register"});
                            }
                            else {
                                /*if (password === result.password) {*/
                                bcrypt.compare(password, result.password, (error, succeed) => {
                                    if (error) {
                                        console.log(error);
                                        res.status(400).json({
                                            responseCode: 400,
                                            responseMessage: 'Password incorrect',
                                            result: error
                                        });
                                    }
                                    else {
                                        console.log(succeed);

                                        res.status(200).json({
                                            responseCode: 200,
                                            responseMessage: 'User has succesfully login',
                                            result: succeed
                                        });
                                    }
                                })

                            }
                        }
                    })
                }
            }
        })


    },
    editUser: (req, res) => {
        console.log("777777777777", req.body)
        let criteria = req.body._id;

        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let dob = req.body.dob;
        let country = req.body.country;
        let state = req.body.state;
        let telephone_no = req.body.telephone_no;
        let gender = req.body.gender;
        let blocked = req.body.blocked;

        let setValue = {};
        setValue.address = {};
        if (firstname !== undefined && /^[A-Za-z]{2,20}$/.test(firstname)) {
            setValue.firstname = firstname
        }
        if (lastname !== undefined && /^[A-Za-z]{2,20}$/.test(lastname)) {
            setValue.lastname = lastname
        }
        if (dob !== undefined && common_js_functions.dateValidation(dob)) {
            setValue.dob = dob
        }
        if (country !== undefined) {
            setValue.address.country = country
        }
        if (state !== undefined) {
            setValue.address.state = state
        }
        if (telephone_no !== undefined && /^(7|8|9)\d{9}$/.test(telephone_no)) {
            setValue.telephone_no = telephone_no
        }
        if (gender !== undefined && ['male', 'female'].includes(gender)) {
            setValue.gender = gender
        }
        if (blocked !== undefined && [true, false].includes(blocked)) {
            setValue.blocked = blocked
        }
        console.log(setValue)
        User.findOneAndUpdate({_id: criteria}, {$set: setValue}, {new: true}, (err, succees) => {
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
    getUserData: (req, res) => {
        let personal = req.query.personal;
        let business = req.query.business;
        let blocked = req.query.blocked;
        if (personal == 1) {
            User.aggregate({
                    $match: {
                        pages: []
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
                })
        }
        else if (business == 1) {
            User.aggregate({
                    $match: {
                        pages: {$exists: true, $nin: [[]]}
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
                })
        }
        else if (blocked == 1) {
            User.aggregate({
                    $match: {
                        blocked: true
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
                })
        }
        else {
            User.aggregate(
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
                })
        }


    },
    getUsers: (req, res) => {

        let personal=req.query.personal;
        let business=req.query.business;
        let blocked=req.query.blocked;
        console.log(personal);
        console.log(business);

        if (personal==1) {
            User.find({pages:[]}, (err, success) => {
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
        else if(business==1) {


            User.find({pages:{$not:{$size: 0}}}, (err, success) => {
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

        else if(blocked==1) {
            User.find({blocked:true}, (err, success) => {
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
            User.find({}, (err, success) => {
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
    blockUser: (req, res) => {
        let emailCriteria = req.body.email;
        console.log("777777777", req.body.email);
        if (emailCriteria === undefined || !/\S+@\S+\.\S+/.test(emailCriteria)) {
            common_js_functions.responseHandler(req, res, "Please enter emailId of user to block");
            return;
        }
        User.findOne({email: emailCriteria}, (error, success) => {
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
                if (success === null) {
                    res.status(404).send({
                        "responseCode": 404,
                        "responseMessage": "Unsuccessful",
                        "response": "No user found"
                    });
                }
                else {
                    if (success.blocked) {
                        User.findOneAndUpdate({email: emailCriteria}, {blocked: false}, {new: true}, (err, succeed) => {
                            if (err) {
                                console.log(err);
                                res.status(400).send({
                                    "responseCode": 400,
                                    "responseMessage": "Unsuccessful",
                                    "response": err.message
                                });
                            }
                            else {
                                console.log(succeed);
                                res.status(200).send({
                                    "responseCode": 200,
                                    "responseMessage": "Successful",
                                    "response": succeed
                                });
                            }
                        })
                    }
                    else {
                        User.findOneAndUpdate({email: emailCriteria}, {blocked: true}, {new: true}, (err, succeed) => {

                            if (err) {
                                console.log(err);
                                res.status(400).send({
                                    "responseCode": 400,
                                    "responseMessage": "Unsuccessful",
                                    "response": err.message
                                });
                            }
                            else {
                                console.log(succeed);
                                res.status(200).send({
                                    "responseCode": 200,
                                    "responseMessage": "Successful",
                                    "response": succeed
                                });
                            }
                        })
                    }

                }

            }
        })

    },
    createReport: (req, res) => {

        require("jsreport").render("<h1>Hello world</h1>").then(function (out) {
            //pipe pdf with "Hello World"
            console.log(out)
            res.set('Content-type', 'application/pdf');
            res.send(out.content)
        });
    }


};
