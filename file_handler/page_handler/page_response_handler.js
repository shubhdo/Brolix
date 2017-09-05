let mongoose=require('mongoose');
let Page=require('../mongo_handler/Models/Page');
let common_js_functions=require('../common_files/js/js_functions');

module.exports={
    addPage:(req,res)=> {
        let created_by=req.body.created_by;
        let page_name=req.body.page_name;
        let description=req.body.description;
        console.log(created_by)

        if (page_name===undefined||!/^[A-Za-z]{2,20}$/.test(page_name)) {
            common_js_functions.responseHandler(req,res,"Please enter page name between 2-30 characters only")
            return;
        }
        if (created_by===undefined||!mongoose.Types.ObjectId.isValid(created_by)) {
            common_js_functions.responseHandler(req,res,"Please enter valid User id")
            return;

        }
        if (description===undefined||!/^[A-Za-z ]{2,}$/.test(description)) {
            common_js_functions.responseHandler(req,res,"Please enter valid email including @ symbol")
            return;

        }
        let page=new Page({
            created_by:created_by,
            description:description,
            page_name:page_name,
        });

        page.save((err, succees) => {
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
        });
    },
    editPage:(req,res)=> {
        let pageIdCriteria=req.body.pageId;
        let created_by=req.body.created_by;
        let page_name=req.body.page_name;
        let description=req.body.description;

        let setValue={};

        if(pageIdCriteria===undefined||!mongoose.Types.ObjectId.isValid(pageIdCriteria)) {
            common_js_functions.responseHandler(req,res,"Please enter valid page Id to edit")
            return;
        }
        if (created_by!==undefined&&mongoose.Types.ObjectId.isValid(created_by))
        {
            setValue.created_by=created_by
        }
        if (page_name!==undefined&&/^[A-Za-z]{2,20}$/.test(page_name))
        {
            setValue.page_name=page_name
        }
        if (description!==undefined&&/^[A-Za-z ]{2,}$/.test(description))
        {
            setValue.description=description
        }
        console.log(setValue)
        Page.findOneAndUpdate({_id:pageIdCriteria},{$set:setValue},{new:true},(err, succees) => {
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
    blockPage:(req,res)=> {
        let pageIdCriteria=req.body.pageId;
        if (pageIdCriteria===undefined||mongoose.Types.ObjectId(pageIdCriteria)) {
            common_js_functions.responseHandler(req,res,"Please enter valid page Id to block")
            return;
        }
        Page.findOneAndUpdate({_id:pageIdCriteria},{blocked:true},{new:true},(err,success)=> {
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
    removePage:(req,res)=> {

        let pageIdCriteria=req.body.pageId;

        if (pageIdCriteria===undefined||mongoose.Types.ObjectId(pageIdCriteria)) {
            common_js_functions.responseHandler(req,res,"Please enter valid page Id to delete data")
            return;
        }
        Page.findOneAndUpdate({_id:pageIdCriteria},{status_active:false},{new:true},(err,success)=> {
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

    }
};