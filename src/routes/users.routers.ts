import express from 'express'
import { register } from 'module'
import { loginController, registercontroller } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

//tạo userRoute
const userRouter = express.Router()

userRouter.post('/login', loginValidator, loginController)
// handler

// phát triển tính năng đăng ký register
// users/register req.body {email và password}
userRouter.post('/register', registercontroller)

export default userRouter
