const mongoose = require('mongoose');

let db = mongoose.connection;

db.on('error', function (error) {
    console.log(error);
});

db.once('open', function () {
    console.log("connected");
});

module.exports= {
    mongo_url:"mongodb://localhost:27017/brolix",
    server_port:3000
}
