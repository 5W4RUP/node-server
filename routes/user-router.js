const express = require('express')

const UserCtrl = require('../controllers/UserController')
const authenticateUser = require('../middlewares/auth')

const router = express.Router()
module.exports = router

router.get('/', (req, res) => {
    res.send('Hello Notify Developers New!')
})
router.post('/user', UserCtrl.createUser)

// router.get('/users', UserCtrl.getUsers)

// router.get('/user/:id', authenticateUser, UserCtrl.getUsers)

router.post('/login', UserCtrl.loginUser)

// router.post('/fblogin', UserCtrl.fbLogin)

// router.put('/update-user', authenticateUser, UserCtrl.updateUser)

// router.put('/change-password', authenticateUser, UserCtrl.changePassword)

//router.get('/hello-world', UserCtrl.helloworld)

router.get('/hello-world', function(req, res){
    UserCtrl.helloworld
});