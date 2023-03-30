require('../model/User')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports = async function (context) {
    const connectDB = async () => {
        try {
            await mongoose.connect(process.env.DATABASE_URI, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            });
        } catch (err) {
            console.error(err);
        }
    }
    connectDB()
    const User = mongoose.model('User')
    const { user, pwd } = context.req.body;
    if (!user || !pwd) return context.res = {status: 400, body: { 'message': 'Username and password are required.' }};

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return context.res = {status: 401} //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        // Send authorization roles and access token to user
        context.res = {
            "headers": {
                "content-type": "application/json"
            },
            "body": { roles, accessToken },
            "cookies": [{
                name: "jwt",
                value: refreshToken,
                secure: true,
                httponly: true,
                path: "/",
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "None",
            }]
        }
    } else {
        context.res = {status: 401}
    }

}
