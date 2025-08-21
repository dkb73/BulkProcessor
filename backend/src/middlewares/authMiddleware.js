const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
    let token;

    // 1) Check if the token exists in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'You are not logged in. Please log in to get access.' });
    }

    try {
        // 2) Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if the user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });
        }

        // 4) Grant access to the protected route
        req.user = currentUser; // Attach the user to the request object
        next(); // Move to the next middleware/controller
    } catch (error) {
        return res.status(401).json({ status: 'fail', message: 'Invalid token. Please log in again.' });
    }
};