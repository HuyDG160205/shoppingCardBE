import { NextFunction, Request, Response } from 'express'
import {
  ChangePasswordReqBody,
  loginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayLoad,
  VerifyEmailReqQuery,
  VerifyForgotPasswordTokenReqBody
} from '~/models/requests/users.requests'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { UserVerifyStatus } from '~/constants/enums'

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

export const verifyEmailTokenController = async (
  req: Request<ParamsDictionary, any, any, VerifyEmailReqQuery>,
  res: Response,
  next: NextFunction
) => {
  //khi họ bấm vào link, thì họ sẽ gửi email_verify_token lên thông qua
  //req.query
  const { email_verify_token } = req.query
  const { user_id } = req.decode_email_verify_token as TokenPayLoad

  //kiểm tra xem trong database có user nào sở hữu là user_id trong payload
  //email_verify_token
  const user = await usersServices.checkEmailVerifyToken({ user_id, email_verify_token })
  //kiểm tra xem user tìm dc bị banned chưa, chưa thì mới verify
  if (user.verify == UserVerifyStatus.Banned) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED, //401
      message: USERS_MESSAGES.EMAIL_HAS_BEEN_BANNED
    })
  } else {
    // chưa verify thì mình verify
    const result = await usersServices.verifyEmail(user_id)

    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
      result
    })

    // sau khi verify xong thì
  }
}

export const resendVerifyEmailController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  //dùng user_id tìm user đó
  const { user_id } = req.decode_authorization as TokenPayLoad

  //kiểm tra user đó có verify hay bị banned không ?
  const user = await usersServices.findUserById(user_id)
  // nếu k thì mới resendEmailVerify
  if (!user)
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: USERS_MESSAGES.USER_NOT_FOUND
    })

  if (user.verify == UserVerifyStatus.Verified) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.OK,
      message: USERS_MESSAGES.EMAIL_HAS_BEEN_VERIFIED
    })
  } else if (user.verify == UserVerifyStatus.Banned) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.OK,
      message: USERS_MESSAGES.EMAIL_HAS_BEEN_BANNED
    })
  } else {
    // chưa verify thì resend
    await usersServices.sendEmailVerify(user_id)
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_TOKEN_SUCCESS
    })
  }
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body
  const hasUser = await usersServices.checkEmailExist(email)
  if (!hasUser) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  } else {
    await usersServices.forgotPassword(email)
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    })
  }
}

export const verifyForgotPasswordTokenController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  // vào được đây có nghĩa là forgot_password_token trong body là hợp lệ
  const { forgot_password_token } = req.body
  // lấy thêm user_id để tìm xem user có sở hữu forgot_password này không
  const { user_id } = req.decode_forgot_password_token as TokenPayLoad
  // kiểm tra xem forgot_password_token còn trong database này không?
  await usersServices.checkForgotPasswordToken({ user_id, forgot_password_token })
  // nếu qua hàm trên êm xui thì nghĩa là token hợp lệ
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  // vào được đây có nghĩa là forgot_password_token trong body là hợp lệ
  const { forgot_password_token, password } = req.body
  // lấy thêm user_id để tìm xem user có sở hữu forgot_password này không
  const { user_id } = req.decode_forgot_password_token as TokenPayLoad
  // kiểm tra xem forgot_password_token còn trong database này không?
  await usersServices.checkForgotPasswordToken({ user_id, forgot_password_token })
  // nếu qua hàm trên êm xui thì nghĩa là token hợp lệ thì mình reset
  await usersServices.resetPassword({ user_id, password })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
  })
}

export const getMeController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response, //
  next: NextFunction
) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  // với user_id này tìm dc thông tin user đó
  // nhưng mình k nên đưa hết thông tin cho ngta
  const userInfor = await usersServices.getMe(user_id)

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    userInfor
  })
}

export const updateMeController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response, //
  next: NextFunction
) => {
  // người ta gửi access lên để chứng minh là họ đã đăng nhập
  // đồng thời cũng cho mình biết họ là ai thông qua user_id từ payload
  const { user_id } = req.decode_authorization as TokenPayLoad
  //req.body chứa các thuộc tính mà người dùng muốn cập nhập
  const payload = req.body // payload là nhưng gì người dùng gửi lên
  //ta muốn account phải verify thì mới được cập nhật thông tin
  await usersServices.checkEmailVerifed(user_id)
  // nếu gọi hàm trên mà k có gì xảy ra thì nghĩa là user đã verify r
  // mình tiến hành cập nhật thông tin mà người dùng cung cấp
  const userInfor = await usersServices.updateMe({ user_id, payload })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.UPDATE_PROFILE_SUCCESS,
    userInfor
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const { old_password, password } = req.body

  await usersServices.changePassword({
    user_id,
    old_password,
    password
  })

  // nếu đổi thành công thì
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
  })
}
