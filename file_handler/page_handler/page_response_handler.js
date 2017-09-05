let Page=require('../mongo_handler/Models/Page');

module.exports={
    addPage:(req,res)=> {
        let created_by=req.body.created_by;
        let page_name=req.body.page_name;
        let description=req.body.description;

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

        if (created_by!==undefined)
        {
            setValue.created_by=created_by
        }
        if (page_name!==undefined)
        {
            setValue.page_name=page_name
        }
        if (description!==undefined)
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