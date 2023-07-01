const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const sendEmail = require('./../utils/email');
const User = require('../models/user-model')
dotenv.config()

createUser = async (req, res) => {
    try {
        const body = req.body

        if (Object.entries(body).length !== 3 && body.constructor === Object)
            throw new Error('You must provide a User')

        const password = Math.random().toString(36).slice(-8)
        body.password = bcrypt.hashSync(password, 10)
        const userObj = new User(body)
        console.log("19",password);
        if (Object.entries(userObj).length === 0 && userObj.constructor === Object)
            return res.status(400).json({ success: false, error: {} })

        const emailExists = await User.findOne({ email: body.email })

        if (emailExists)
            throw new Error('Email already exists')
        else if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(body.email)))
            throw new Error('Invalid Email')

        const newUser = await userObj.save()
        if (!newUser)
            throw new Error('User not created')

        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     auth: {
        //         user: 'ryder.koch37@ethereal.email',
        //         pass: 'XvgbD96udKW1r3H2HF'
        //     }
        // });

        // let info = await transporter.sendMail({
        //     from: 'ryder.koch37@ethereal.email', // sender address
        //     to: body.email, // list of receivers
        //     subject: "Auto Generated Password", // Subject line
        //     text: "Your password is", // plain text body
        //     html: `<b>${password}</b>`, // html body
        // });
        /*const mailmessage = `Your password is ${password}`;
        sendEmail({
            email: body.email,
            subject: "Auto Generated Password",
            message : mailmessage
        });*/

        return res.status(201).json({
            success: true,
            id: User._id,
            message: 'User created!',
        })
    } catch (error) {
        return res.status(400).json({
            error,
            message: error.message,
        })
    }
}

updateUser = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    try {
        const user = await User.findOne({ _id: req.JWTObject.id });
        user.first_name = body.first_name;
        user.last_name = body.last_name;
        await user.save();
        return res.status(200).json({
            success: true,
            data: { id: user._id, first_name: user.first_name, last_name: user.last_name },
            message: 'User updated!',
        })
    } catch (e) {
        return res.status(404).json({
            e,
            message: 'User not updated!',
        })
    }
}

changePassword = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    try {
        const user = await User.findOne({ _id: req.JWTObject.id })
        if (!user) {
            return res.status(404).json({
                message: 'Email is not registered',
            })
        }

        if (user.password) {
            const passwordMatch = await bcrypt.compare(req.body.old_password, user.password)
            if (!passwordMatch) {
                return res.status(404).json({
                    message: 'Password mismatch',
                })
            }
        }
        if (req.body.new_password.length < 8 || req.body.new_password.length > 16) {
            return res.status(404).json({
                message: 'Password length must be minimum 8 charecter and maximum 16 charecter',
            })
        }

        const password = bcrypt.hashSync(req.body.new_password, 10);
        user.password = password;
        await user.save();

        return res.status(200).json({
            success: true,
            data: { id: user._id, old_password: req.body.old_password, new_password: req.body.new_password },
            message: 'Password Updated',
        })
    } catch (e) {
        console.error(e)
        return res.status(404).json({
            e,
            message: 'Password not updated!',
        })
    }
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, User) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!User) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: User })
    }).catch(err => console.log(err))
}

getUserById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, User) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!User) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: User })
    }).catch(err => console.log(err))
}

getUsers = async (req, res) => {
    await User.find({}, (err, Users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!Users.length) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: Users })
    }).catch(err => console.log(err))
}

getDemo = async (req, res) => {
    await User.find({}, (err, Users) => {
        return res.status(200).json({ success: true, data: "demo" })
    }).catch(err => console.log(err))
}

loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user)
            throw new Error('Email is not registered')

        if (!user.password)
            throw new Error('Login using facebook')

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch)
            throw new Error('Password mismatch')

        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '2h' })

        return res.status(200).json({
            data: {
                token: token,
                user: user
            },
            expires_in: '2h'
        })
    } catch (error) {
        return res.status(400).json({
            error,
            message: error.message,
        })
    }
}

fbLogin = async (req, res) => {
    try {
        const { name, email } = req.body
        const nameArr = name.split(' ')
        const first_name = nameArr[0]
        const last_name = nameArr[1]

        let user = await User.findOne({ email })
        if (!user) {
            const userObj = new User({ first_name, last_name, email })
            user = await userObj.save()
        }

        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '2h' })

        return res.status(200).json({
            data: {
                token: token,
                user: user
            },
            expires_in: '2h'
        })
    } catch (error) {
        return res.status(400).json({
            error,
            message: error.message,
        })
    }
}


module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    loginUser,
    changePassword,
    fbLogin
}