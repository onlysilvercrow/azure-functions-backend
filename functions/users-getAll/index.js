require('../../model/User')
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
    const users = await User.find();
    if (!users) return context.res = {status: 204, body: {'message': 'No users found'}}
        context.res = {
            "headers": {
                "content-type": "application/json"
            },
            "body": users
        }
}