import { Request, Response } from 'express'
import { RegisterReqBody } from '~/models/requests/users.requests'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
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

export const registercontroller = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { email } = req.body
  // gọi service và tạo user từ email, password trong req.body
  // lưu user đó vào users collection của mongoDB
  try {
    // kiểm tra email có bị trùng chưa | email có tồn tại chưa | email có ai dùng chưa
    const isDup = await usersServices.checkEmailExist(email)

    if (isDup) {
      const customError = new Error('Email has been used')
      Object.defineProperty(customError, 'message', {
        enumerable: true
        //* cái này mấy thk senior có khi còn k code dc
      })

      throw customError
    }
    const result = await usersServices.register(req.body)

    res.status(201).json({
      message: 'Register successfully !',
      data: result
    })
  } catch (error) {
    res.status(422).json({
      message: 'Register failed !!!',
      error
    })
  }
}
