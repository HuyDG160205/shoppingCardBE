// import các interface của express giúp em mô tả
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'

// middleware là handler có nhiệm vụ kiểm tra các dữ liệu mà ng dùng
//  gửi lên thông qua request
// middleware đảm nhận vai trò kiểm tra dữ liệu đủ và đúng kiểu

// bây giờ mình sẽ mô phỏng chức năng đăng nhập
// nếu 1 ng dùng muốn đăng nhập họ sẽ gửi lên email password
// thông qua req.body
//* middleware k dc chạm vs database
//* đây là tằng mỏng
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  // lấy thử email và password trong req.body mà ng dùng gửi lên

  const { email, password } = req.body
  //   kiểm tra email và password có được gửi lên
  if (!email || !password) {
    res.status(422).json({
      message: 'Missing Email or Password'
    })
  } else {
    next()
  }
}

export const registerValidator = checkSchema({
  name: {
    notEmpty: {
      errorMessage: 'Name is required'
    },
    isString: {
      errorMessage: 'Name must be a string'
    },
    trim: true,
    isLength: {
      options: {
        min: 1,
        max: 500
      },
      errorMessage: 'Names Length must be inbetween 1-100'
    }
  },
  email: {
    notEmpty: {
      errorMessage: 'Email is required'
    },
    isEmail: true,
    trim: true
  },
  password: {
    notEmpty: {
      errorMessage: 'password is required'
    },
    isString: {
      errorMessage: 'Password must be a string'
    },
    isLength: {
      options: {
        min: 8,
        max: 50
      }
    },
    isStrongPassword: {
      options: {
        minLength: 1,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: true
      }
    }
  }
})
