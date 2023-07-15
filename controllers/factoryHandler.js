const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const sendEmail = require('./../utils/email');
const User = require('../models/user-model')
dotenv.config()



 const catchAsync = fn =>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
 };
 getOne =  (Model,popOption) =>catchAsync(
        async (req, res)=>{console.log('async req',popOption);
        await Model.findById(req.params.id, (err, Model) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                //if(popOption) Model = Model.populate(popOption);
                if (!Model) {
                    return res
                        .status(404)
                        .json({ success: false, error: `User not found` })
                }
                return res.status(200).json({ success: true,
                data: Model })
            })
            .populate(popOption) /**If want to populate full data under _id field */
            .catch(err => console.log(err))
        
        });
module.exports = {
    getOne
}