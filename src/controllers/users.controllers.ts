import { NextFunction, Request, Response } from 'express'
import { loginReqBody, LogoutReqBody, RegisterReqBody, TokenPayLoad } from '~/models/requests/users.requests'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { Result } from 'express-validator'

export const registercontroller = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body
  // gọi service và tạo user từ email, password trong req.body
  // lưu user đó vào users collection của mongoDB

  // kiểm tra email có bị trùng chưa | email có tồn tại chưa | email có ai dùng chưa
  const isDup = await usersServices.checkEmailExist(email)

  if (isDup) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS
    })
  }
  const result = await usersServices.register(req.body)

  res.status(HTTP_STATUS.CREATED).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, loginReqBody>,
  res: Response,
  next: NextFunction
) => {
  //cần lấy emali và password để tìm xe user nào đag sở hưu

  //nếu k có user nào thì ngừng cuộc chơi

  //nếu có thì tạo at và rf
  const { email, password } = req.body

  const result = await usersServices.login({ email, password })
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result //ac rf
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  //xem thử user_id trong payload cùa refresh_token và access có giống không?
  const { refresh_token } = req.body
  const { user_id: user_id_at } = req.decode_authorization as TokenPayLoad
  const { user_id: user_id_rf } = req.decode_refresh_token as TokenPayLoad

  if (user_id_at != user_id_rf) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED, // 401
      message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID
    })
  }
  //nếu mà trùng rồi thì mình xem thử refresh_token có dc quyền dùng dịch vụ khong?

  await usersServices.checkRefreshToken({
    user_id: user_id_at,
    refresh_token
  })
  //khi nào có mã đó trong database thì mình tiến hành logout(xóa rf khỏi hệ thống)
  await usersServices.logout(refresh_token)
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}
