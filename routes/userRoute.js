const express = require('express')
const router = express.Router()
const {getAllUsers,createUser,getUserById,updateUser,deleteUser} = require('../controllers/userController')
const {signup} = require('../controllers/authController')

router.post('/signup',signup)

router
.route('/')
.get(getAllUsers)
.post(createUser);

router
.route('/:id')
.get(getUserById)
.patch(updateUser)
.delete(deleteUser);

module.exports = router