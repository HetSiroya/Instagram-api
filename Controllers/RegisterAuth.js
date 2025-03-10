const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const RigsterModel = require('../Models/RigsterModel');
const bcrypt = require('bcryptjs');
const Users = require('../Models/Users');
const generatetoken = require('../Helpers/tokens');
const { generateOTP } = require('../Helpers/OTP');




const exOTP = generateOTP()
const otp = exOTP.toString()
exports.registerpost = async (req, res) => {
    try {
        const { email } = req.body;
        let rigster = await RigsterModel.findOne({ email: email });
        if (rigster) {
            rigster.otp = otp;
            await rigster.save();
        } else {
            rigster = new RigsterModel({
                email: email,
                otp: otp
            });
        }
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

        await login.save();
        const token = generatetoken(login)

        user.token = token;

        const data = await Users.findByIdAndUpdate(
            login._id,
            { token: token },
            { new: true }
        );



        await otpRecord.deleteOne(); // Now `otpRecord` has the `deleteOne` method.

        return res.status(200).json({
            status: true,
            message: 'User registered successfully',
            data: data,
            token: token
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.Login = async (req, res) => {
    try {
        const { input, password } = req.body;
        console.log("input", input);
        console.log("password", password);

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        const isMobileNumber = /^\d+$/.test(input);
        const query = isEmail ? { email: input } : isMobileNumber ? { Mobilenumber: Number(input) } : { username: input };
        const user = await Users.findOne(query).lean();
        // console.log("user", user);
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log("isMatch", isMatch);
        if (!user) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid Password" });
        }

        // Generate token
        const token = generatetoken(user);
        const data = await Users.findByIdAndUpdate(
            user._id,
            { token: token },
            { new: true }
        );
        res.status(200).send({ message: "Login Successful", data });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({ status: false, message: 'An error occurred', data: {} });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const user = req.user;

        const { password, newpassword } = req.body;

        // const user = await Users.findById(decoded.id).lean();
        console.log("user", user.password);

        console.log("password", password);
        console.log("user", user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("isMatch", isMatch);
        if (!isMatch) {
            return res.status(400).json({ status: false, message: 'Invalid Password', data: {} });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        const updatedata = await Users.findByIdAndUpdate(user._id, { password: hashedPassword });
        const token = generatetoken(updatedata);
        const data = await Users.findByIdAndUpdate(
            user._id,
            { token: token },
            { new: true }
        );
        return res.status(200).json({ status: true, message: 'Password changed successfully', data: data });
    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { input, password, confirm } = req.body;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        const isMobileNumber = /^\d+$/.test(input);
        const query = isEmail ? { email: input } : isMobileNumber ? { Mobilenumber: Number(input) } : { username: input };
        const user = await Users.findOne(query).lean();
        console.log("user", user);
        if (!user) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }
        if (password !== confirm) {
            return res.status(400).send({ message: "Passwords do not match" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.findByIdAndUpdate(user.id, { password: hashedPassword });
        const updatedata = await Users.findById(user._id);
        const token = generatetoken(updatedata);
        const data = await Users.findByIdAndUpdate(
            user._id,
            { token: token },
            { new: true }
        );
        return res.status(200).json({
            status: true,
            message: 'Password changed successfully',
            data: data,
        });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

exports.updatedata = async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        const { name, email, bio, gender, username, Mobilenumber } = req.body;
        const existingUser = await Users.findOne({
            $or: [
                { email: email },
                { username: username },
                { Mobilenumber: Mobilenumber },
            ],
        });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ status: false, message: 'Email already exists', data: {} });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ status: false, message: 'Username already exists', data: {} });
            }
            if (existingUser.Mobilenumber === Mobilenumber) {
                return res.status(400).json({ status: false, message: 'Mobile number already exists', data: {} });
            }
        }

        let updatedata = { name, email, bio, gender, username, Mobilenumber };

        const updatedUser = await Users.findByIdAndUpdate(
            user._id,
            { $set: updatedata },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: 'User not found', data: {} });
        }
        console.log(updatedUser);

        const token = generatetoken(updatedUser);
        const data = await Users.findByIdAndUpdate(
            user._id,
            { token: token },
            { new: true }
        );
        res.status(200).json({
            status: true,
            message: 'User data updated successfully',
            data: data,
            token: token
        });
    } catch (error) {
        console.error("Error updating user data:", error.message);
        return res.status(500).json({ status: false, message: 'Error updating user data', data: {} });
    }
}

exports.logout = async (req, res) => {
    try {
        const user = req.user;
        const updatedUser = await Users.findByIdAndUpdate(
            user._id,
            { token: null },
            { new: true }
        );
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

