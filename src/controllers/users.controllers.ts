import { NextFunction, Request, Response } from 'express'
import { RegisterReqBody } from '~/models/requests/users.requests'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
// controller là handler có nhiệm vụ tập kết dữ liệu từ người dùng và
// phân phát vào các services đúng chỗ

// controller là nơi tập kết và xữ lý logic cho các dữ liệu nhận được
// trong controller các dữ liệu đều phải clean

export const loginController = (req: Request, res: Response) => {
  // xử lý logic cho dữ liệu
  const { email, password } = req.body
  //   lên database kiểm tra email và password của account nào
  //   xà lơ
  if (email === 'HuyDepTrai@gmail' && password === 'weArePiedTeam') {
    res.status(200).json({
      message: 'login Succussfully !!!',
      data: {
        fname: 'Huy là người đẹp trai nhất',
        yob: 1999
      }
    })
  } else {
    res.status(401).json({
      message: 'Invalid Email or Password'
    })
  }
}

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
      message: 'Email already been used!'
    })
  }
  const result = await usersServices.register(req.body)

  res.status(201).json({
    message: 'Register successfully !',
    data: result
  })
}
