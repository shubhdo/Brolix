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

    randomNo:function (low,high) {
        return Math.floor(Math.random*(high-low)+low)
    }





}

