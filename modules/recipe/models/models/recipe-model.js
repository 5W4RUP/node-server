const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Recipe = new Schema(
    {
        title: { type: String, required: true},
         description: { type: String},
         attachment: { type: String},
        type: { type: Number},
        status: { type: Number},
    //     subrecipe : { type: Array,
    //     // name: String,
    //     // tags: String,
    //     // link: String  
    //    },
        created_by: { type: Number, required: true },
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

module.exports = mongoose.model('recipes', Recipe)