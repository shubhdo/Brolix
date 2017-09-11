const express = require('express')
const body_parser = require('body-parser');
const morgan=require('morgan')
const multer=require('multer');
const path=require('path')
const fs=require('fs')
const cloudinary=require('cloudinary');

const config=require('./file_handler/config/config_dev')


let upload = multer({dest: 'uploads/'});

cloudinary.config({
    cloud_name:config.cloud_name,
    api_key:config.api_key,
    api_secret:config.api_secret
});

const app=express();

let port = process.env.PORT || 4000;
app.use(morgan('dev'))
app.use(body_parser.json());

app.post('/videoUpload',upload.single('file'),(req,res)=> {
    console.log(req.file);

    let videoFormat=req.file.originalname.split('.')[1]
    console.log(videoFormat);
    cloudinary.v2.uploader.upload(req.file.path,{resource_type:"video",format:"mp4"},(error,result)=> {
       console.log("0000000000",error,result);
        if (!result.public_id) {
            res.status(400).json({
                responseCode: 400,
                responseMessage: error,
            });
        }
        else {
            res.status(200).json({
                responseCode: 200,
                responseMessage: 'Image successfully updated',
                response:result.secure_url
            });
        }

        fs.unlink(req.file.path);

    });

});


app.listen(port, () => {
    console.log("listening on port "+port)
});
