import express from 'express'
import { loginController, registercontroller } from '~/controllers/users.controllers'
import { accessTokenValidator, loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

//tạo userRoute
const userRouter = express.Router()

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

/**
 * description: login
 * path: users/login
 * method:post
body :{
    email:string,
    password: string
}

 */
userRouter.post('/login', loginValidator, wrapAsync(loginController))

/*
    desc: logout
    path:users/logout
    method: post
    headers:{
        Authorization: 'Bearer <access_token>'
    }
    body:{
        refresh_token: string
    }

*/
userRouter.post('/logout', accessTokenValidator, (req, res) => {
  res.json('success')
})

export default userRouter
