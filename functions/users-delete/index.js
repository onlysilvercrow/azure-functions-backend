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
    if (!req?.body?.id) return context.res = {status: 400, body: {"message": 'User ID required'}}
        const user = await User.findOne({ _id: req.body.id }).exec();
        if (!user) return context.res = {status: 204, body: {'message': `User ID ${req.body.id} not found` }}
            const result = await user.deleteOne({ _id: req.body.id });;
            context.res = {
                "headers": {
                    "content-type": "application/json"
                },
                "body": result
            }
}


// if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
//     const user = await User.findOne({ _id: req.body.id }).exec();
//     if (!user) {
//         return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
//     }
//     const result = await user.deleteOne({ _id: req.body.id });
//     res.json(result);