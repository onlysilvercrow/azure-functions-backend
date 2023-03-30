require('../model/User')
const mongoose = require('mongoose');
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
    const myCookie = context.req.headers['cookie']
    const cookies = myCookie.substring(4);
    if (!cookies) return context.res = {status: 401};
    const refreshToken = cookies;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return context.res = {status: 403}; //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return context.res = {status: 403};
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            currentUser = decoded.username;
            context.res = {
                "headers": {
                    "content-type": "application/json"
                },
                "body": { roles, accessToken, currentUser }
            }
        }
    );
}