const express = require('express')
const NoteCtrl = require('../controllers/NoteController')
const authenticateUser = require('../middlewares/auth')
const router = express.Router()
module.exports = router

router.get('/notes', authenticateUser, NoteCtrl.getNotes)

router.put('/note',authenticateUser, NoteCtrl.updateNote)

router.delete('/note', authenticateUser, NoteCtrl.deleteNote)

router.post('/note',authenticateUser,NoteCtrl.createNote);
router.get('/notefactory/:id', NoteCtrl.getNoteFactory); 

/**By using factory function */

// router
//   .route('/note')
//   .put(NoteCtrl.updateNote)
//   .delete(NoteCtrl.deleteNote);
// router
//   .route('/notes')
//   .get(NoteCtrl.getNotes);
// router
//   .route('/note/:id')
//   .get(NoteCtrl.getNotes);  



