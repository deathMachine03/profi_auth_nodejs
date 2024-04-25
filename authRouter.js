const Router = require('express')
const router = new Router()
const  controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')

router.post('/registration',[
    check('username',"имя пользователя не может быть пустым").notEmpty(),
    check('password',"Пароль должен быть не короче 4 символов и не длиннее 10").isLength({min:4, max:10})
],controller.registration)
router.post('/login', controller.login)
router.get('/users',roleMiddleware(['ADMIN']), controller.getUsers)

module.exports = router