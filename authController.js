const User = require('./models/user')
const Role = require('./models/role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult } = require('express-validator')
const {secret} = require("./config")
const generateAccessToken = (id,roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload,secret, {expiresIn: "24h"})
}

class authController{
    async registration(req,res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка при регистрации", errors})
            }
            const {username,password} = req.body
            const candidate = await User.findOne({username})
            if (candidate)  {
                return res.status(400).json({message:"Пользователь с таким именем существует"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({username, password: hashPassword, roles: userRole.value}); // передайте строку, а не массив
            await user.save()
            return res.json({message:"Пользователь успешно зарегистрирован"})
        } catch (e){
            console.log(e)
            res.status(400).json({message: 'Ошибка регистрации'})
        }
    }
    async login(req,res){
        try{
            const {username,password} = req.body
            const user = await User.findOne({username})
            if(!user) {
                return res.status(400).json({message:`Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password,user.password)
            if(!validPassword) {
                return res.status(400).json({message:`Введен не верный пароль`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e){
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }
    async getUsers(req,res){
        try{
            const users = await User.find()
            res.json(users)
            // const userRole = new Role()
            // const adminRole = new Role({value:"ADMIN"})
            // await userRole.save()
            // await adminRole.save()
            // res.json("server pashet")
        } catch (e){
            console.log(e)
        }
    }
}

module.exports = new authController()