const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d',
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined; // Remove password from the output

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide name, email, and password' });
        }

        const newUser = await User.create({ name, email, password });
        createSendToken(newUser, 201, res);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ status: 'fail', message: 'Email already exists.' });
        }
        res.status(500).json({ status: 'error', message: 'Something went wrong', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        createSendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Something went wrong', error: error.message });
    }
};

exports.getMe = async (req,res)=>{
    res.status(200).json({
        status:'success',
        data:{
            user: req.user
        }
    });
};