let mongoose = require('mongoose');
let Page = require('../mongo_handler/Models/Page');
let User = require('../mongo_handler/Models/User');

let common_js_functions = require('../common_files/js/js_functions');

module.exports = {
    addPage: (req, res) => {
        let created_by = req.body.created_by;
        let page_name = req.body.page_name;
        let description = req.body.description;
        console.log(created_by)

        if (page_name === undefined || !/^[A-Za-z ]{2,20}$/.test(page_name)) {
            common_js_functions.responseHandler(req, res, "Please enter page name between 2-30 characters only")
            return;
        }
        if (created_by === undefined || !mongoose.Types.ObjectId.isValid(created_by)) {
            common_js_functions.responseHandler(req, res, "Please enter valid User id")
            return;

        }
        if (description === undefined || !/^[A-Za-z ]{2,}$/.test(description)) {
            common_js_functions.responseHandler(req, res, "Please enter some description")
            return;

        }
        let page = new Page({
            created_by: created_by,
            description: description,
            page_name: page_name,
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

                User.findOneAndUpdate({_id: created_by}, {$push: {pages: succees._id}}, (finalError, finalResponse) => {
                    if (finalError) {
                        console.log(finalError);
                        res.status(400).send({
                            "responseCode": 400,
                            "responseMessage": "Unsuccessful",
                            "response": finalError.message
                        });
                    }
                    else {
                        console.log(finalResponse);
                        res.status(200).send({
                            "responseCode": 200,
                            "responseMessage": "Successful",
                            "response": finalResponse
                        });
                    }
                });
            }
        });
    },
    getPagesData: (req, res) => {

        let removedPages = req.query.removePages;
        let blockedPages = req.query.blockPages;
        let unpublishedPages = req.query.unpublishedPages;

        console.log(removedPages);
        console.log(blockedPages);
        console.log(unpublishedPages)
        if (removedPages == 1) {

            Page.aggregate({
                    $match: {
                        status_active: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: {$sum: 1}
                    }
                }, (err, success) => {
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
        }
        else if (unpublishedPages == 1) {

            Page.aggregate({
                    $match: {
                        page_ads: []
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: {$sum: 1}
                    }
                }, (err, success) => {
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
        }
        else if (blockedPages == 1) {
            Page.aggregate({
                    $match: {
                        blocked: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: {$sum: 1}
                    }
                }, (err, success) => {
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

        }
        else {
            Page.aggregate(
                {
                    $group: {
                        _id: null,
                        count: {$sum: 1}
                    }
                }, (err, success) => {
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
        }


    },
    editPage: (req, res) => {
        let pageIdCriteria = req.body._id;
        let page_name = req.body.page_name;
        let description = req.body.description;

        console.log("@@@@@@@@@@@",req.body)
        let setValue = {};

        if (pageIdCriteria === undefined || !mongoose.Types.ObjectId.isValid(pageIdCriteria)) {
            common_js_functions.responseHandler(req, res, "Please enter valid page Id to edit")
            return;
        }
        if (page_name !== undefined && /^[A-Za-z]{2,20}$/.test(page_name)) {
            setValue.page_name = page_name
        }
        if (description !== undefined && /^[A-Za-z ]{2,}$/.test(description)) {
            setValue.description = description
        }
        console.log(setValue)
        Page.findOneAndUpdate({_id: pageIdCriteria}, {$set: setValue}, {new: true}, (err, succees) => {
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
    blockPage: (req, res) => {
      /*  let pageIdCriteria = req.body.pageId;
        if (pageIdCriteria === undefined || mongoose.Types.ObjectId(pageIdCriteria)) {
            common_js_functions.responseHandler(req, res, "Please enter valid page Id to block")
            return;
        }
        Page.findOneAndUpdate({_id: pageIdCriteria}, {blocked: true}, {new: true}, (err, success) => {
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
        })*/
        let pageIdCriteria = req.body._id;
        console.log("777777777", req.body._id);
        if (pageIdCriteria === undefined || !mongoose.Types.ObjectId(pageIdCriteria)) {
            common_js_functions.responseHandler(req, res, "Please enter valid page Id to block")
            return;
        }
        Page.findOne({_id: pageIdCriteria}, (error, success) => {
            if (error) {
                console.log(error);
                res.status(400).send({
                    "responseCode": 400,
                    "responseMessage": "Unsuccessful",
                    "response": error.message
                });

            }
            else {
                console.log("**************", success);
                if (success === null) {
                    res.status(404).send({
                        "responseCode": 404,
                        "responseMessage": "Unsuccessful",
                        "response": "No user found"
                    });
                }
                else {
                    if (success.blocked) {
                        Page.findOneAndUpdate({_id: pageIdCriteria}, {blocked: false}, {new: true}, (err, succeed) => {
                            if (err) {
                                console.log(err);
                                res.status(400).send({
                                    "responseCode": 400,
                                    "responseMessage": "Unsuccessful",
                                    "response": err.message
                                });
                            }
                            else {
                                console.log(succeed);
                                res.status(200).send({
                                    "responseCode": 200,
                                    "responseMessage": "Successful",
                                    "response": succeed
                                });
                            }
                        })
                    }
                    else {
                        Page.findOneAndUpdate({_id: pageIdCriteria}, {blocked: true}, {new: true}, (err, succeed) => {

                            if (err) {
                                console.log(err);
                                res.status(400).send({
                                    "responseCode": 400,
                                    "responseMessage": "Unsuccessful",
                                    "response": err.message
                                });
                            }
                            else {
                                console.log(succeed);
                                res.status(200).send({
                                    "responseCode": 200,
                                    "responseMessage": "Successful",
                                    "response": succeed
                                });
                            }
                        })
                    }

                }

            }
        })



    },
    removePage: (req, res) => {

        let pageIdCriteria = req.body.pageId;

        if (pageIdCriteria === undefined || mongoose.Types.ObjectId(pageIdCriteria)) {
            common_js_functions.responseHandler(req, res, "Please enter valid page Id to delete data")
            return;
        }
        Page.findOneAndUpdate({_id: pageIdCriteria}, {status_active: false}, {new: true}, (err, success) => {
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

    getPages:(req,res)=> {

        let unpublished = req.query.unpublished;
        let blocked = req.query.blocked;
        let removed = req.query.removed;

        console.log(unpublished);
        console.log(blocked);
        if (unpublished == 1) {
            Page.find({page_ads:[]}, (err, success) => {
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
        }
        else if(blocked==1) {
            Page.find({blocked:true}, (err, success) => {
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
        }
        else if(removed==1) {
            Page.find({status_active:false}, (err, success) => {
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
        }
        else {
            Page.find({}, (err, success) => {
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
        }
    },
    createReport: (req, res) => {

    }
};