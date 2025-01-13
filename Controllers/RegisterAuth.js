const mongoose = require('mongoose');
const User = require('../Models/User');
const nodemailer = require('nodemailer');
const RigsterModel = require('../Models/RigsterModel');

function generateOTP() {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * digits.length)];
    }
    return OTP;
}
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
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
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
exports.users = async (req, res) => {
    try {
        const { name, email, otplogin, bio, gender, username } = req.body;
        const login = new User({ name, email, otplogin, bio, gender, username });
        const user = await RigsterModel.findOne({ email: email, otp: otplogin });
        if (!user) {
            return res.status(404).json({ message: 'Wrong OTP' });
        }

        const otpRecord = await RigsterModel.findOne({ email }); // Removed `.lean()`
        if (!otpRecord) return res.status(404).json({ status: false, message: 'OTP not found', data: {} });
        if (otpRecord.otp !== otplogin) return res.status(400).json({ status: false, message: 'Invalid OTP', data: {} });

        await login.save();
        await otpRecord.deleteOne(); // Now `otpRecord` has the `deleteOne` method.

        return res.status(200).json({
            status: true,
            message: 'User registered successfully',
            data: login
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
