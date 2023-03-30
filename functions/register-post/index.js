require('../../model/User')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
module.exports = async function (context, req, res) {
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
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return context.res = {status: 409, body: {'message': 'username taken'}}; //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });

        context.log(result);
        context.res = {
            status: 201,
            body: {'success':`New user ${user} created!`}
        }

    } catch (err) {
        context.res = {status: 500, body: { 'message': err.message }}
    }
}


