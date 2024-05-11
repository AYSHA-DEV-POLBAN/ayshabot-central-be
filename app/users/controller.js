
const User = require('./model')
module.exports = {
    users: async (req, res) => {
        try {
            const user = await User.findAll();  
            res.status(200).json({ data: user });
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
}