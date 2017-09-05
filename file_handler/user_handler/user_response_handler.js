let User=require('../mongo_handler/Models/User')
let common_js_functions=require('../common_files/js/js_functions')

module.exports= {
    addUser:(req, response) => {
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let dob = req.body.dob;
        let country = req.body.country;
        let state = req.body.state;
        let telephone_no = req.body.contact;
        let gender=req.body.gender;

        if (firstname===undefined||!/^[A-Za-z]{2,20}$/.test(firstname)) {
            common_js_functions.responseHandler(req,response,"Please enter first name between 3-30 characters only")
            return;
        }
        if (lastname===undefined||!/^[A-Za-z]{2,20}$/.test(lastname)) {
            common_js_functions.responseHandler(req,response,"Please enter last name between 3-30 characters only")
            return;

        }
        if (email===undefined||!/\S+@\S+\.\S+/.test(email)) {
            common_js_functions.responseHandler(req,response,"Please enter valid email including @ symbol")
            return;

        }
        if (dob===undefined||!common_js_functions.dateValidation(dob)) {
            common_js_functions.responseHandler(req,response,"Age range should be between 18-60")
            return;
        }
        if (telephone_no===undefined||!/^(7|8|9)\d{9}$/.test(telephone_no)) {
            common_js_functions.responseHandler(req,response,"Please enter 10 digits with nos starting with 7,8,9")
            return;
        }
        if (gender===undefined||! ['male','female'].includes(gender)) {
            common_js_functions.responseHandler(req,response,"Please select your gender male or female")
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
            gender:gender
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
    editUser:(req,res)=> {
        console.log(req.body)
        let criteria=req.body.emailId;

        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let dob = req.body.dob;
        let country = req.body.country;
        let state = req.body.state;
        let telephone_no = req.body.contact;
        let gender=req.body.gender;
        let blocked=req.body.blocked;
        let emailCriteria=req.body.emailToFind;

        let setValue={};
        setValue.address={};
        if (firstname!==undefined&&/^[A-Za-z]{2,20}$/.test(firstname))
        {
            setValue.firstname=firstname
        }
        if (lastname!==undefined&&/^[A-Za-z]{2,20}$/.test(lastname))
        {
            setValue.lastname=lastname
        }
        if (email!==undefined&&/\S+@\S+\.\S+/.test(email))
        {

            common_js_functions.responseHandler(req,res,"Email cannot be altered");
        }
        if (dob!==undefined&&common_js_functions.dateValidation(dob))
        {
            setValue.dob=dob
        }
        if (country!==undefined)
        {
            setValue.address.country=country
        }
        if (state!==undefined)
        {
            setValue.address.state=state
        }
        if (telephone_no!==undefined&&/^(7|8|9)\d{9}$/.test(telephone_no))
        {
            setValue.telephone_no=telephone_no
        }
        if (gender!==undefined&&['male','female'].includes(gender))
        {
            setValue.gender=gender
        }
        if (blocked!==undefined&&[true,false].includes(blocked))
        {
            setValue.blocked=blocked
        }
        console.log(setValue)
        User.findOneAndUpdate({email:criteria},{$set:setValue},{new:true},(err, succees) => {
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
    blockUser:(req,res)=> {
        let emailCriteria=req.body.emailToFind;
        if (emailCriteria===undefined||!/\S+@\S+\.\S+/.test(emailCriteria))
        {
            common_js_functions.responseHandler(req,res,"Please enter emailId of user to block");
            return;
        }
        User.findOneAndUpdate({email:emailCriteria},{blocked:true},{new:true},(err,success)=> {
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
                if(success===null) {
                    res.status(404).send({
                        "responseCode": 404,
                        "responseMessage": "Unsuccessful",
                        "response": "No user found"
                    });
                }
                else {
                    res.status(200).send({
                        "responseCode": 200,
                        "responseMessage": "Successful",
                        "response": success
                    });
                }

            }
        })
    },
    createReport:(req,res)=> {

        require("jsreport").render("<h1>Hello world</h1>").then(function(out) {
            //pipe pdf with "Hello World"
            console.log(out)
            res.set('Content-type','application/pdf');
            res.send(out.content)
        });
    }


};
