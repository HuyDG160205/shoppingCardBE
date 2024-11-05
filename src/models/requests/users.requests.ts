// file này lưu các định nghĩa của các Request

import { JwtPayload } from 'jsonwebtoken'
import { TOKEN_TYPE } from '~/constants/enums'

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface loginReqBody {
  email: string
  password: string
}

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TOKEN_TYPE
}

export interface LogoutReqBody {
  refresh_token: string
}
