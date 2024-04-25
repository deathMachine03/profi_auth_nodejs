const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.port || 5000

const app = express()

app.use(express.json())
app.use("/auth", authRouter)

const start = async () => {
    try{
        await mongoose.connect('mongodb+srv://user:user123@cluster0.rijs8yj.mongodb.net/auth_roles?retryWrites=true&w=majority')
        app.listen(PORT,()=>console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()