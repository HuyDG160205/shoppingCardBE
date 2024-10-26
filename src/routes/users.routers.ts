import express from 'express'
import { loginController, registercontroller } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

//tạo userRoute
const userRouter = express.Router()

userRouter.post('/login', loginValidator, loginController)
/**
    desc: Register a new user
    path: /register
    method: post
    body:{
        name: string,
        email: string,
        password: string,
        confirm_password: string,
        date_of_birth: string có cấu trúc là ISO8601
    }
 */
userRouter.post('/register', registerValidator, registercontroller)

export default userRouter
