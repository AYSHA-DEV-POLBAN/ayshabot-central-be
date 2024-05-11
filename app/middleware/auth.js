const config = require('../../config')

const jwt = require('jsonwebtoken');

const Users = require('../users/model')
module.exports = {
    isLoginAdmin: (req, res, next) => {
        if (req.session.user === null || req.session.user === undefined) {
            req.flash('alertMessage', `Mohon maaf Sesi  anda habis silahkan login `)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
          
        } else {
            next();
        }
    },
    isLoginUser: async (req, res, next) => {
        
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
            // console.log(token);
            // console.log(config.jwtKey);
           
            // return
            const data = jwt.verify(token, config.jwtKey);

            // console.log('====================================');
            // console.log(data);
            // console.log('====================================');
            // // console.log(data);
            // return;
            const user = await Users.findOne({id: data.user.id })
            if(!user){
                throw new Error()
            }
            req.user = user
            req.token = token
            next();
        } catch (err) { 
            console.log(err);
            res.status(401).json({
                error:'not authorized to access'
            })
        }
    }
}