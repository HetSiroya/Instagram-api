const mongoose = require('mongoose');
// const User = require('../Models/Login');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const RigsterModel = require('../Models/RigsterModel');
const Login = require('../Models/Login');
const generatetoken = require('../Helpers/tokens');

function generateOTP() {

    // Declare a digits variable 
    // which stores all digits  
    let digits = '0123456789';
    let OTP = '';
    let len = digits.length
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
}
// function generatetoken(user) {
//     const playload = {
//         id: user._id,
//         email: user.email,
//         otp: user.otplogin,
//         bio: user.bio,
//         gender: user.gender,
//         username: user.username,
//         Mobilenumber: user.Mobilenumber,
//         password: user.password
//     }
//     let jwtScecrte = process.env.JWT_SECRET_KEY;
//     const token = jwt.sign(playload, jwtScecrte)
//     return token
// }

const exOTP = generateOTP()
const otp = exOTP.toString()
exports.registerpost = async (req, res) => {
    try {
        const { email } = req.body;
        const rigster = new RigsterModel({
            email: email,
            otp: otp
        })
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hetsiroya@gmail.com',
                pass: 'qmaf tvyd whjt ckpq'
            }
        });
        var mailOptions = {
            from: 'hetsiroya@gmail.com',
            to: 'hsiroya669@rku.ac.in',
            subject: 'Sending Email using Node. js',
            text: `
            email: ${email}
            Otp:${otp}`
        };
        // console.log(mailOptions);
        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //     }
        // });
        rigster.save();
        return res.status(200).json({
            status: true,
            message: 'User registered successfully',
            data: rigster
        })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
}
exports.Login = async (req, res) => {
    try {
        const { name, email, otplogin, bio, gender, username, Mobilenumber, password } = req.body;
        const login = new Login({ name, email, otplogin, bio, gender, username, Mobilenumber, password });

        const user = await RigsterModel.findOne({ email: email, otp: otplogin });
        if (!user) {
            return res.status(404).json({ message: 'Wrong OTP' });
        }
        const otpRecord = await RigsterModel.findOne({ email }); // Removed `.lean()`
        if (!otpRecord) return res.status(404).json({ status: false, message: 'OTP not found', data: {} });
        if (otpRecord.otp !== otplogin) return res.status(400).json({ status: false, message: 'Invalid OTP', data: {} });

        const token = generatetoken(login)


        await login.save();
        await otpRecord.deleteOne(); // Now `otpRecord` has the `deleteOne` method.

        return res.status(200).json({
            status: true,
            message: 'User registered successfully',
            data: login,
            token: token
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
