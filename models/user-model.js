const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String },
    }
)

module.exports = mongoose.model('users', User)