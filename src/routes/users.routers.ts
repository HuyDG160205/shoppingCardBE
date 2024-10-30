import { error } from 'console'
import express from 'express'
import { promiseHooks } from 'v8'
import { loginController, registercontroller } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

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
userRouter.post('/register', registerValidator, wrapAsync(registercontroller))

// controller là requestHandler cuối cùng
// chỉ next() thì xuống requestHandler tiếp theo
// next(new Error('Rớt Mạng')) thì xuống errorHandler
// server chỉ throw chứ ko next()
export default userRouter
