const express = require('express')
const RecipeCtrl = require('../controllers/RecipeController')
const authenticateUser = require('../middlewares/auth')
const router = express.Router()
module.exports = router

// router.get('/notes', authenticateUser, NoteCtrl.getNotes)

// router.put('/note',authenticateUser, NoteCtrl.updateNote)

// router.delete('/note', authenticateUser, NoteCtrl.deleteNote)

// router.post('/note',authenticateUser,NoteCtrl.createNote);


router
  .route('/recipe/:id')
  .put(RecipeCtrl.updateRecipe)
  .delete(RecipeCtrl.deleteRecipe);
  router
  .route('/recipeImage/:id')
  .put(RecipeCtrl.updateImage);
router
  .route('/recipes')
  .get(RecipeCtrl.getRecipes)
  .post(RecipeCtrl.createRecipe);
  router
  .route('/recipes-tags')
  .get(RecipeCtrl.getRecipesTags);
// router
//   .route('/note/:id')
//   .get(NoteCtrl.getNotes);  



