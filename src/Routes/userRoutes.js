const express = require('express')

const userController = require('../Controller/UserController')
const roleController = require('../Controller/roleController')

const router = express.Router()

// Auth
router.post("/login", userController.loginAuth)
router.post("/regist", userController.registUser)
router.post("/logOut", userController.logOut)

// Roles
router.put('/roles', roleController.updateRole)
router.get("/roles", roleController.getRole)
router.post('/roles', roleController.addRole)
router.delete('/roles/:id', roleController.deleteRole)

// User
router.get("/user", userController.getUser)
router.put('/user', userController.updateUser)
router.delete('/user', userController.deleteUser)

module.exports = router