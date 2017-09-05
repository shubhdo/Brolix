const countries = require('country-list')();
const states = require('countryjs')
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
    }
}
