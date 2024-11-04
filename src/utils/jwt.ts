import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { resolve } from 'path'
import { reject } from 'lodash'

dotenv.config()

//file này lưu hàm dùng để tạo ra 1 token
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) throw reject(error)
      else return resolve(token as string)
    })
  })
}

// làm hàm giúp kiểm tra 1 token có đúng với chữ ký hay ko
// nếu đúng thì trả ra payload đang có trong token đó

export const verifyToken = ({
  token,
  privateKey = process.env.JWT_SECRET as string
}: {
  token: string
  privateKey?: string
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, privateKey, (error, decode) => {
      if (error) throw reject(error)
      else return resolve(decode as jwt.JwtPayload)
    })
  })
}
