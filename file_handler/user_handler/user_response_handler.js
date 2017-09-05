let User=require('../mongo_handler/Models/User')

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
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let dob = req.body.dob;
        let country = req.body.country;
        let state = req.body.state;
        let telephone_no = req.body.contact;
        let gender=req.body.gender;
        let emailCriteria=req.body.emailToFind;

        let setValue={};
        setValue.address={};
        if (firstname!==undefined)
        {
            setValue.firstname=firstname
        }
        if (lastname!==undefined)
        {
            setValue.lastname=lastname
        }
        if (email!==undefined)
        {
            setValue.email=email
        }
        if (dob!==undefined)
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
        if (telephone_no!==undefined)
        {
            setValue.telephone_no=telephone_no
        }
        if (gender!==undefined)
        {
            setValue.gender=gender
        }
        console.log(setValue)
        User.findOneAndUpdate({email:emailCriteria},{$set:setValue},{new:true},(err, succees) => {
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
                res.status(200).send({
                    "responseCode": 200,
                    "responseMessage": "Successful",
                    "response": success
                });
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
