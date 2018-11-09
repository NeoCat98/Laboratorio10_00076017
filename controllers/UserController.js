const mongoose = require('mongoose'); 
const User = require("../models/users"); 
const AuthController = {};
const bcrypt = require('bcrypt');
AuthController.login = function (req, res, next) {
    res.render('signin'); //
}
AuthController.create = function (req, res, next) {
    res.render('signup')
}
AuthController.store = async function (req, res) {
    let user = {
        email: req.body.email,
        password: req.body.password
    }

    await User.create(user, (error, user) => { 
        if (error) 
            return res.render('signup', { err: error, email: user.email });
        else {
            let data = {
                userId: user._id.toString(),
                email: user.email,
                password: user.password
            }
            bcrypt.hash(data.userId, 10, function (err, hash) {
                if (err) { 
                    next(err); 
                }
                
                data.userId = hash;
                req.session.user = JSON.stringify(data);
                console.log(req.session.user);
                return res.redirect('/users/profile');
            });
        }
    })

};
AuthController.profile = function (req, res) {
    return res.render('profile');
}
AuthController.signin = function (req, res,next) {
    var data = {};
    User.authenticate(req.body.email, req.body.password, (error, user) => {
        if (error || !user) {
            res.render('signin', { err: error, email: req.body.email });
        }
        else {
                data.userId= user._id.toString(),
                data.email= user.email,
                data.password=user.password
            bcrypt.hash(data.userId, 10, function (err, hash) {
                if (err) {
                    next(err);
                }
                data.userId = hash;
                req.session.user = JSON.stringify(data);
                return res.redirect('/users/profile');
            });

        }
    });
};
AuthController.logout = function (req, res, next) {
    if (req.session) { 
        req.session.destroy(function (err) { 
            if (err) {
                next(err);
            }
            else {
                res.redirect('/');
            }
        });
    }
}
module.exports = AuthController;