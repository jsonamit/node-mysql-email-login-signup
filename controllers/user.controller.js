const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendResponse } = require("../utils/response");
const { verifyRequest } = require("../library/utils.library");
const { pagination } = require("../utils/paginationHelper");
const { sendEmail, generateOTP } = require("../utils/email");

exports.signup = async (req, res, next) => {
    try {        

        const valid = verifyRequest(req,['mobile','email','name']);

        if(!valid.resp) {
            return res.json(valid);
        }
        
        const findUser = await User.findOne({
            where: { email: req.body.email },
        });

        if(findUser) {
            return sendResponse(res,{
                resp: '0',
                msg: 'Email already exists'
            });
        }

        let params = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
        }
        const user = await User.create(params);

        if (!user) {
            return sendResponse(res,{
                resp: '0',
                msg: 'Something went wrong!'
            });
        }

        const otp = generateOTP();
        const expiry = Date.now() + 5 * 60 * 1000; // valid for 5 minutes

        // Store OTP in DB
        await User.update(
            { otp, otpExpiry: expiry },
            { where: { email: params.email } }
        );

        await sendEmail(
            params.email, // to
            "Signup OTP Mail", // subject
            "welcome", // template name
            { 
                name: params.name,
                otp: otp
            } // params
        );

        return sendResponse(res, {
            resp: 1,
            msg: "OTP successfully sent on your mail!"
        });
        
    } catch (err) {
        return sendResponse(res,{
            resp: 0,
            msg: err.message
        });
    }
};

exports.login = async (req, res, next) => {

    try {
      
        const valid = verifyRequest(req,['email']);
        
        if(!valid.resp) {
            return res.json(valid);
        }

        const user = await User.findOne({
            where: { email: req.body.email },
        });

        if (!user) {
            return sendResponse(res,{
                resp: '0',
                msg: 'User not found'
            });
        }

        const otp = generateOTP();
        const expiry = Date.now() + 5 * 60 * 1000; // valid for 5 minutes

        // Store OTP in DB
        await User.update(
            { otp, otpExpiry: expiry },
            { where: { email: req.body.email } }
        );

        await sendEmail(
            req.body.email, // to
            "Login OTP Mail", // subject
            "loginOtp", // template name
            { otp } // params
        );

        return sendResponse(res, {
            resp: 1,
            msg: "OTP successfully sent on your mail!"
        });

    } catch (err) {
        return sendResponse(res,{
            resp: 0,
            msg: err.message
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {

        const valid = verifyRequest(req,['email','otp']);

        if(!valid.resp) {
            return res.json(valid);
        }

        const { email, otp } = req.body;
    
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
            return sendResponse(res, { 
                resp: 0, 
                msg: "User not found" 
            });
        }

        if (user.otp !== otp) {
            return sendResponse(res, { 
                resp: 0,
                msg: "Invalid OTP" 
            });
        }
    
        if (Date.now() > user.otpExpiry) {
            return sendResponse(res, { 
                resp: 0, 
                msg: "OTP expired" 
            });
        }
  
        // OTP is valid → clear OTP fields
        // user.otp = null;
        // user.otpExpiry = null;
        // await user.save();

        const token = jwt.sign(
            { id: user.id, mobile: user.mobile },
            process.env.JWT_SECRET,                                   
            { expiresIn: process.env.JWT_TOKEN_EXPIRE }                                      
        );

        let responseData = { 
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            token: token
        };
  
        return sendResponse(res, {
            resp: 1,
            msg: "OTP verified successfully",
            data: responseData
        });
    } catch (err) {
        return sendResponse(res, { 
            resp: 0, 
            msg: err.message 
        });
    }
};
  
exports.getUsers = async (req, res, next) => {
    try {

        const { pageNumber, pageSize, offset, sortBy, order } = pagination(req.query, ["createdAt"]);

        const { count, rows } = await User.findAndCountAll({
            offset,
            limit: pageSize,
            order: [[sortBy, order]],
            attributes: ["id", "name", "email", "createdAt"] 
        });

        if(!rows || rows.length == 0) {
            return sendResponse(res,{
                resp: '0',
                msg: 'No users found',
                data:  null
            });
        }
      
        return sendResponse(res,{
            resp: '1',
            msg: 'User list fetched successfully',
            data:  {
                records: rows,
                pagination: { 
                    totalRecords: count, pageNumber, 
                    totalPages: Math.ceil(count / pageSize), 
                    pageSize, 
                    sortBy, 
                    order
                }
            }
        });
    } catch (err) {
        return sendResponse(res,{
            resp: 0,
            msg: err.message
        });
    }
};

