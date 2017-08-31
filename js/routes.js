const routes = require('express').Router();
const mongoose = require('mongoose');
const fs = require('fs');
const crypto=require('crypto');
const countries = require('country-list')();
const states = require('countryjs')
const Company = require('./models/Company');
const Employee = require('./models/Employee')
const async = require('async');
const mail=require('./mail');
const config=require('./password');
let countrydata;
let url = 'mongodb://localhost:27017/company';
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

function encrypt(text) {
    let cipher=crypto.createCipher(config.user.algorithm,config.user.genKey)
    let crypted=cipher.update(text,'utf-8','hex');
    crypted+=cipher.final('hex');
}

routes.post('/addCompany', (req, response) => {
    console.log(req.body)
    let imgbuffer = decodeBase64Image(req.body.img);
    let id = new Date().getTime() + ".jpg"
    let path = './images/img' + id;
    fs.writeFile(path, imgbuffer.data, function (err) {
        if (err)
            console.log(err);
        else
            console.log("File successfully written");
    });
    console.log(imgbuffer)
    let name = req.body.name;
    let username = req.body.uname;
    let website = req.body.website;
    let country = req.body.country;
    let state = req.body.state;
    let city = req.body.city;
    let telephone_no = req.body.contact;
    let description = req.body.desc;
    let password = req.body.password;
    let company = new Company({
        name: name,
        website: website,
        registered_address: {
            country: country,
            state: state,
            city: city
        },
        telephone_no: telephone_no,
        description: description,
        username: username,
        password: password,
        logo: id
    });


    company.save((err, succees) => {
        if (err) {
            response.status(400).send({
                "responseCode": 400,
                "responseMessage": "Unsuccessful",
                "response": err.message
            });

        }
        else {

            console.log("**************", succees);

            /*response.status(200).send({
                "responseCode": 200,
                "responseMessage": "Successful",
                "response": succees
            });*/
        }
    });
});

routes.post('/addEmployee', (req, response) => {
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
    let dob = req.body.dob;
    let country = req.body.country;
    let state = req.body.state;
    let city = req.body.city;
    let telephone_no = req.body.contact;
    let company = req.body.c_id;

    let employee = new Employee({
        name: name,
        company: company,
        email: email,
        address: {
            country: country,
            state: state,
            city: city
        },
        telephone_no: telephone_no,
        dob: dob,
        profile: id

    });

    employee.save((err, succees) => {
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
    let username = req.body.username;
    let password = req.body.password;
    Company.findOne({username: username}, {password: 1, logo: 1}, (err, result) => {
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
                    if (result.logo === undefined) {
                        result.logo='placeholder.jpg';
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


routes.get('/getEmployees', function (req, res) {
    let company = req.query.id;
    if (mongoose.Types.ObjectId.isValid(company)) {
        Company.aggregate({
                $match: {
                    _id: mongoose.Types.ObjectId(company)
                }
            },
            {
                $lookup: {
                    from: 'Employee',
                    localField: "_id",
                    foreignField: "company",
                    as: 'data'
                }
            },
            {
                $project: {
                    "_id": 0,
                    "data._id": 1,
                    "data.name": 1,
                    "data.email": 1
                }
            },
            (error, success) => {
                responseHandler(res, error, success);
            }
        )
    }
    else {
        responseHandler(res, {"message": "String should be a valid ObjectId"}, null);
    }
});


routes.get('/getDetails', function (req, res) {
    let employee = req.query.id;
    if (mongoose.Types.ObjectId.isValid(employee)) {
        Employee.aggregate({
                $match: {
                    _id: mongoose.Types.ObjectId(employee)
                }
            },
            (error, success) => {
            if (success[0].profile===undefined) {
                success[0].profile='placeholder.jpg'
            }

                responseHandler(res, error, success);
            }
        )
    }
    else {
        responseHandler(res, {"message": "String should be a valid ObjectId"}, null);
    }

});


routes.get('/getPaginatedData/:id/:limit/:page', (req, res) => {
    let c_id = req.params.id;
    console.log(c_id);
    let limit = Number(req.params.limit);
    let page = Number(req.params.page);
    if (mongoose.Types.ObjectId.isValid(c_id)) {
        let query = Employee.find({company: c_id})
        Employee.paginate(query, {limit: limit, page: page}, (error, success) => {
            responseHandler(res, error, success);
        })
    }
    else {
        responseHandler(res, {"message": "String should be a valid ObjectId"}, null);
    }
});


module.exports = routes;