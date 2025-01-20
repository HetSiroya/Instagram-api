const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const RigsterModel = require('../Models/RigsterModel');
const bcrypt = require('bcryptjs');
const Users = require('../Models/Users');
const generatetoken = require('../Helpers/tokens');
const { generateOTP } = require('../Helpers/OTP');


// function generateOTP() {


//     let digits = '0123456789';
//     let OTP = '';
//     let len = digits.length
//     for (let i = 0; i < 4; i++) {
//         OTP += digits[Math.floor(Math.random() * len)];
//     }
//     return OTP;
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
exports.Users = async (req, res) => {
    try {
        const { name, email, otplogin, bio, gender, username, Mobilenumber, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedPassword", hashedPassword);
        // const bcrypter = bcrypter(password);
        const login = new Users({ name, email, bio, gender, username, Mobilenumber, password: hashedPassword });
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


exports.Login = async (req, res) => {
    try {
        const { input, password } = req.body;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        const isMobileNumber = /^\d+$/.test(input);
        const query = isEmail ? { email: input } : isMobileNumber ? { Mobilenumber: Number(input) } : { username: input };
        const user = await Users.findOne(query).lean();
        console.log("user", user);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("isMatch", isMatch);
        if (!user) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid Password" });
        }

        // Generate token
        const token = generatetoken(user);
        res.status(200).send({ message: "Login Successful", token });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({ status: false, message: 'An error occurred', data: {} });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        if (!req.body.password || !req.body.newpassword) {
            return res.status(400).json({ status: false, message: 'Password and new password are required', data: {} });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { password, newpassword } = req.body;
        const user = await Users.findById(decoded.id).lean();

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ status: false, message: 'Invalid Password', data: {} });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        await Users.findByIdAndUpdate(decoded.id, { password: hashedPassword });
        const data = await Users.findById(decoded.id);
        // console.log("data", data);
        const tokenh = generatetoken(data);
        return res.status(200).json({ status: true, message: 'Password changed successfully', data: data, token: tokenh });

    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }
}
