const Recipe = require('../models/recipe-model')
const RecipeTags = require('../models/recipetags-model')
const SubRecipe = require('../models/subrecipe-model')
const User = require('../models/user-model')
const AppError = require('../utils/appError');
const util = require('util')
const formidable = require('formidable')
const fs = require('fs')
const sendEmail = require('../utils/email');
const path = require('path')
/** get the data by created by and active and not deleted note */
const uploadPath = path.join(process.cwd(), 'public', 'uploads/')

const maxSize = 2 * 1024 * 1024; // for 2MB
/** get the data by created by and active and not deleted recipe */

getRecipes = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            $and: [
                //{ 'created_by': req.JWTObject.id },
                { 'created_by': 1 },
                { 'deleted_at': null }
            ]
        })
        
        const subrecipe = await SubRecipe.find({recipe_id :recipe._id });
        res.status(200).json({
            status: true,
            data: {
                recipe,
                subrecipe
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

/** create new recipe*/

createRecipe = async (req, res) => {
    try {
        const body = req.body

        const recipeExists = await Recipe.findOne({ created_by: 4 })
        if (!recipeExists){
            const recipe =  new Recipe({ created_by: 4 });
            recipe.title = body.title;
            recipe.description = body.description;
            recipe.coverpic = body.coverpic;
            recipe.type = body.type;
            recipe.status = body.status;
            await recipe.save();
             Id = recipe._id;
        }else{
            const recipe = await Recipe.findOne({ created_by: 4 });
            recipe.title = body.title;
            recipe.description = body.description;
            recipe.coverpic = body.coverpic;
            recipe.type = body.type;
            recipe.status = body.status;
            await recipe.save();
            Id = recipe._id;
        }
        
         const subrecipeExists = await SubRecipe.find({ recipe_id: Id });
        if (subrecipeExists){
            subrecipeExists.map(async function(el){
             const deleteRecipe = await SubRecipe.findOneAndDelete({ _id: el._id });
            })
        }
        if(body.subrecipes){
        body.subrecipes.map(function(el){
            var subrecipe =  new SubRecipe();
            subrecipe.recipe_id = Id;
            subrecipe.name = el.name;
            subrecipetags = el.tags;
            subrecipe.link = el.link;
            subrecipe.save();
        });
       }
        return res.status(201).json({
            success: true,
            id: Recipe._id,
            message: 'Recipe created!',
        })
    } catch (error) {
        return res.status(400).json({
            error,
            message: error.message,
        })
    }
}
updateImage = async (req, res) => {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            Recipe.findOne({ _id: req.params.id }, (err, Recipe) => {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        message: 'Recipe not found!',
                    })
                }
                
                if (typeof files.attachment !== 'undefined' && files.attachment.length != 0 ) {
                    /** Temporary location of our uploaded file */
                    var temp_path = files.attachment.path;
                    /** The file name of the uploaded file */
                    const file_name = Date.now() + '-' + files.attachment.name;
                    var image_size = files.attachment.size;
                    /** check the file extension */
                    var fileExt = files.attachment.name.split('.').pop();
                    /** check the allowed extension */
                    const allowed_extensions = ['jpeg', 'jpg', 'png'];
                    if (image_size > maxSize)
                        return res.status(400).json({
                            success: false,
                            errorcode : 1,
                            message: 'Oops!File size should be less than 2mb',
                        })
                    if (!allowed_extensions.includes(fileExt))
                        return res.status(400).json({
                            success: false,
                            errorcode : 2,
                            message: 'Oops!File extension is not supported',
                        })
    
                    fs.readFile(temp_path, function(err, data) {
                        fs.writeFile(uploadPath + file_name, data, function(err) {
                            fs.unlink(temp_path, function(err) {
                                if (err) {
                                    return res.status(400).json({
                                        success: false,
                                        message: 'Something went wrong!.',
                                    })
                                    } else {
                                        Recipe.attachment = file_name
                                        Recipe.save()
                                                .then(() => {
                                                    return res.status(200).json({
                                                        success: true,
                                                        message: 'Recipe Cover pic is uploaded successfully!.',
                                                    })
                                                })
                                                .catch(error => {
                                                    return res.status(500).json({
                                                        message: error.message
                                                    })
                                                })
                                        
                                }
                            });
                        });
                    });
                }
                Recipe
                    .save()
                    .then(() => {
                        
                        return res.status(200).json({
                            success: true,
                            message: 'Recipe Cover pic is uploaded successfully!.',
                        })
                    })
                    .catch(error => {
                        return res.status(404).json({
                            success: false,
                            message: 'Recipe Cover pic is not uploaded successfully!',
                        })
                    })
            })
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message: 'Something went wrong'
        })
    }    
}
createRecipeold = async (req, res) => {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            
             subdata = [{
                name: 'gray',
                tags: '1',
                link: 4
                },
                {
                name: 'yellow',
                tags: '2',
                link: 4
            }];
            
            //var recipe = new Recipe({ created_by: req.JWTObject.id });
            var recipe = new Recipe({ created_by: 1 });
            recipe.set('title', fields.title);
            recipe.set('description', fields.description);
            recipe.set('coverpic', null);
            recipe.set('status', fields.status);
            
            //recipe.set('subrecipe',fields.subrecipe);
            recipe.set('type', fields.type);

           /* recipe.save().then(() => {
                recipeId = recipe._id;
                 subdata.map(function(el){
                    var subrecipe = new SubRecipe();
                    subrecipe.set('recipe_id', recipeId);
                    subrecipe.set('name', el.name);
                    subrecipe.set('tags', el.tags);
                    subrecipe.set('link', el.link);
                    subrecipe.save().then(() => {
                            return res.status(200).json({
                                success: true,
                                message: 'Recipe is added successfully!.',
                            })
                       })
                });
                
            })
            .catch(error => {
                return res.status(500).json({
                    message: error.message
                })
            })*/
            
        })    
        
        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message: 'Something went wrong!'
        })
    }
}

/** delete the recipe by created by */
deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndDelete({ "_id": req.params.id, "created_by": 4});
        const subrecipeExists = await SubRecipe.find({ recipe_id: req.params.id });
        if (subrecipeExists){
            subrecipeExists.map(async function(el){
             const deleteRecipe = await SubRecipe.findOneAndDelete({ _id: el._id });
            })
        }
        if (!recipe) {
            throw new Error();
        }
        res.status(200).json({
            status: true,
            data: {
                message: 'Recipe deleted successfully!'
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Sorry! this recipe can not be deleted'
        });
    }
};

/** update the data by id */
updateRecipe = async (req, res) => {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            Recipe.findOne({ _id: req.params.id }, (err, Recipe) => {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        message: 'Recipe not found!',
                    })
                }
                
                /////       updated fields          ////
                Recipe.name = fields.name,
                    Recipe.tags = fields.tags,
                    Recipe.type = fields.type,
                    Recipe.status = fields.status,
                    Recipe.link = fields.link,
                    Recipe.updated_at = Date.now()
                    Recipe.save()
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            message: 'Recipe is updated successfully!.',
                        })
                    })
                    .catch(error => {
                        return res.status(404).json({
                            success: false,
                            message: 'Recipe not updated!',
                        })
                    })
            })
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message: 'Something went wrong'
        })
    }    
}

/** get the data by created by and active and not deleted recipe */

getRecipesTags = async (req, res) => {
    try {
        const recipetags = await RecipeTags.find({}, {
            name: 1,_id:0
          })
        res.status(200).json({
            status: true,
            data: {
                recipetags
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};



module.exports = {
    updateRecipe,
    deleteRecipe,
    getRecipes,
    createRecipe,
    getRecipesTags,
    updateImage
}