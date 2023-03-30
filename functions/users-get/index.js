require('../../model/User')
const mongoose = require('mongoose');
module.exports = async function (context, req) {
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
    if (!req?.params?.id) return context.res = {status: 400, body: {"message": 'User ID required'}}
        const username = await User.findOne({ _id: req.params.id }).exec();
        if (!username) return context.res = {status: 204, body: {'message': `User ID ${req.params.id} not found`}}
            context.res = {
                body: {
                username
                }
            }
    
    
        //context.res.json({ 'message': 'No users found' });
}
