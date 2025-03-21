const express = require('express')

const userController = require('../Controller/UserController')
const roleController = require('../Controller/roleController')
const tokenController = require('../Controller/tokenController')
const authenticateJWT = require('../../Middleware/auth')

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
router.get("/user", authenticateJWT, userController.getUser)
router.put('/user', userController.updateUser)
router.delete('/user', userController.deleteUser)

// Token
router.post("/refresh-token", tokenController.refreshAccessToken)
router.post("/generate-refresh-token", tokenController.generateRefreshTokenController)

module.exports = router