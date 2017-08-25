const routes = require('express').Router();
const mongoose = require('mongoose');
const Company = require('./models/Company');
const Employee = require('./models/Employee')
const async = require('async');

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

function responseHandler(response, err, succees) {
    if (err) {
        console.log(err);
        response.status(400).send({"error": err.message})
    }
    else {
        console.log(succees);
        response.status(200).json(succees)
    }
}

routes.post('/addCompany', (req, res) => {
    console.log(req.body)
    let name = req.body.name;
    let website = req.body.website;
    let country = req.body.registered_address.country;
    let state = req.body.registered_address.state;
    let city = req.body.registered_address.city;
    let telephone_no = req.body.telephone_no;
    let description = req.body.description;
    let username = req.body.username;
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
        password: password
    });

    company.save((err, sucees) => {
        responseHandler(res, err, sucees);
    });
});

routes.post('/addEmployee', (req, res) => {
    console.log(req.body)
    let name = req.body.name;
    let email = req.body.email;
    let gender = req.body.gender;
    let dob = req.body.dob;
    let country = req.body.registered_address.country;
    let state = req.body.registered_address.state;
    let city = req.body.registered_address.city;
    let telephone_no = req.body.telephone_no;
    let company = req.body.company;

    let employee = new Employee({
        name: name,
        email: email,
        registered_address: {
            country: country,
            state: state,
            city: city
        },
        telephone_no: telephone_no,
        gender: gender,
        dob: dob,
        company: company

    });

    employee.save((err, sucees) => {
        responseHandler(res, err, sucees);
    });
});


routes.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    Company.findOne({username: username}, {password: 1}, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: "something failed"});
        }

        else {
            if (result === null) {
                res.status(404).send({error: "Email does not exist. Please registar"});
            }
            else {

                if (password === result.password) {
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


routes.get('/getEmployees',function (req,res) {
   let company=req.query.id;
   Company.aggregate({
       $match:{
        _id: mongoose.Types.ObjectId(company)
       }
       },
       {
         $lookup:{
             from:'Employee',
             localField:"_id",
             foreignField:"company",
             as:'data'
         }
       },
       {
         $project:{
             "_id":0,
             "data._id":1,
             "data.name":1,
             "data.email":1
         }
       },
       (error, success) => {
           responseHandler(res,error,success);
       }
   )

});



routes.get('/getDetails',function (req,res) {
    let employee=req.query.id;
    Employee.aggregate({
            $match:{
                _id: mongoose.Types.ObjectId(employee)
            }
        },
        (error, success) => {
            responseHandler(res,error,success);
        }
    )

});





module.exports = routes;