
const User = require('../users/model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config')
module.exports = {
    signup: async (req, res) => {
        console.log(req);
        try {
            const { name, username, email, password } = req.body;
             // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name,
                username,
                email,
                password: hashedPassword,
      });
            res.status(200).json({ data: newUser });
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
    signin: async(req,res)=>{
        const { email, password } = req.body;
        User.findOne({ where: { email: email } }).then((user)=>{
          if (user) {
            const checkpassword = bcrypt.compareSync(password,user.password)
            if(checkpassword){
                const token = jwt.sign({
                    user: {
                        id: user.id,
                        name:user.name,
                        username: user.username,
                        email: user.email,
                       
                    }
                }, config.jwtKey)
                res.status(200).json({
                    data:{token}
                })  
            } else {
                res.status(403).json({
                    message: 'password yan anda masukan salah / akun belum terdaftar'
                })  
            }
            
          }else {
            res.status(403).json({
                message: 'email yan anda masukan belum terdaptar'
            })
        }
        })
    }
}