const countries = require('country-list')();
const states = require('countryjs')
const path=require('path');
let countrydata;

module.exports= {
 getCountries:   function (req, res) {
        countrydata = countries.getData();
        res.status(200).send({
            "responseCode": 200,
            "responseMessage": "Successful",
            "response": countrydata
        });
    },
    getStates:function (req, res) {
        console.log(req.query);
        console.log(countrydata)
        let obj = (countrydata.find(x => x.name === req.query.country))
        let data = states.states(obj.code);

        res.status(200).send({
            "responseCode": 200,
            "responseMessage": "Successful",
            "response": data
        });
    },
    serveAngularPage:(req,res)=> {
     res.sendFile(path.join(__dirname+"/../../../assests/index.html"))
        console.log(path.join(__dirname+"/../../../assests/index.html"))
    }
}
