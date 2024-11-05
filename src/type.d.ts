import { Request } from 'express'
import { TokenPayLoad } from './models/requests/users.requests'

declare module 'express' {
  interface Request {
    decode_authorization?: TokenPayLoad
    decode_refresh_token?: TokenPayLoad
  }
}
