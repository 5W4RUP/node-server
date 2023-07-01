const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubRecipe = new Schema(
    {
        name: { type: String, required: true},
        tags: { type: String},
        link: { type: String},
        recipe_id: { type: String, required: true },
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

module.exports = mongoose.model('subrecipes', SubRecipe)