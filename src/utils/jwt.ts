import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { resolve } from 'path'
import { reject } from 'lodash'
import { TokenPayLoad } from '~/models/requests/users.requests'

dotenv.config()

//file này lưu hàm dùng để tạo ra 1 token
export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | Buffer | object
  privateKey: string
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

export const verifyToken = ({ token, privateKey }: { token: string; privateKey: string }) => {
  return new Promise<TokenPayLoad>((resolve, reject) => {
    jwt.verify(token, privateKey, (error, decode) => {
      if (error) throw reject(error)
      else return resolve(decode as TokenPayLoad)
    })
  })
}
