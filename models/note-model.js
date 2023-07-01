const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Note = new Schema(
    {
        title: { type: String},
        description: { type: String},
        attachment: { type: String, required: true},
        type: { type: Number},
        status: { type: Number},
        created_by: { type: String, required: true },
        created_at: {
            type: Date,
            default: Date.now(),
            select: true
        },
        updated_at: {
            type: Date,
            default: null,
            select: false
        },  
        deleted_at: {
            type: Date,
            default: null,
            select: false
        },  

    }
)

module.exports = mongoose.model('notes', Note)