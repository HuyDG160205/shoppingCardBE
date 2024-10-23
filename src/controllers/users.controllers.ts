import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseServices from '~/services/database.services'
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

export const registercontroller = async (req: Request, res: Response) => {
  const { email, password } = req.body
  // gọi service và tạo user từ email, password trong req.body
  // lưu user đó vào users collection của mongoDB
  try {
    const result = await databaseServices.users.insertOne(
      new User({
        email,
        password
      })
    )
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
