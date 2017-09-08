module.exports={
    convertFromBase64:   function decodeBase64Image(dataString) {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
    },

    randomNo:function (low,high,limit) {
        let randNo=[];
        console.log("//////////",low,high,limit);
        while (randNo.length!==limit) {
           let x=Math.floor(Math.random()*(high-low)+low)
           if (!randNo.includes(x))
               randNo.push(x);
        }
        return randNo;
    },
    dateValidation:function dateValidation(dob) {
        let date = new Date();
        let dateMax = date.getTime() - 1000 * 60 * 60 * 24 * 365.25 * 18;
        let dateMin =date.getTime()- 1000 * 60 * 60 * 24 * 365.25 * 60 ;
        console.log(new Date(dateMax))
        console.log(new Date(dateMin))
        let currentDate=new Date(dob).getTime();

        return currentDate > dateMin && currentDate < dateMax;
    },

    responseHandler: responseHandler=function (req,res,msg) {
        res.status(400).send({
            "responseCode": 400,
            "responseMessage": "Unsuccessful",
            "response": msg
        });
    }




}


