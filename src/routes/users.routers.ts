import express from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registercontroller,
  resendVerifyEmailController,
  verifyEmailTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
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
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

// userRouter.post("/me")

/**
    desc: verify email
khi người dùng nhấn vào link có trong email của họ
thì evt sẽ dc gửi lên server backend thông qua req.query
path: users/verify-email/?email_verify_token=string
method: get
 */

userRouter.get(
  '/verify-email', //
  emailVerifyTokenValidator,
  wrapAsync(verifyEmailTokenController)
)

/*
    desc: resend email verify token
    người dùng sẽ dùng chức năng này khi làm mất, lạc email
    phải đăng nhập thì mới cho verify
    header: {
        authorization: 'Bearer <access_token>'
    }
    method: post
*/

userRouter.post(
  '/resend-verify-email',
  accessTokenValidator, //
  wrapAsync(resendVerifyEmailController)
)

/*
    desc: forgot password
    khi quên mật khẩu thì dùng chức năng này
    path: users/forgot-password
    method: post
    body: {
        email: string
    }
*/
userRouter.post(
  '/forgot-password',
  forgotPasswordValidator, //
  wrapAsync(forgotPasswordController)
)

export default userRouter
