require('../model/User')
const mongoose = require('mongoose');


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
    if (!cookies) {return context.res = {status: 204}}; //No content
    const refreshToken = cookies;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        return  context.res = {
            status: 204,
            "cookies": [{
                name: "jwt",
                value: '',
                secure: true,
                httponly: true,
                path: "/",
                maxAge: -2,
                sameSite: "None",
            }]
        };
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();

    context.res = {
        status: 200,
        "cookies": [{
            name: "jwt",
            value: '',
            secure: true,
            httponly: true,
            path: "/",
            maxAge: -2,
            sameSite: "None",
        }]
    };
}


