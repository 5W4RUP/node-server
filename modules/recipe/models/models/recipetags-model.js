const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecipeTags = new Schema(
    {
        name: { type: String, required: true},
        created_at: {
            type: Date,
            default: Date.now(),
            select: true
        }
    }
)

module.exports = mongoose.model('recipestags', RecipeTags)