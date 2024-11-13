//hàm mod lại req.body theo mảng các key mình muốn

import { pick } from 'lodash'
import { Request, Response, NextFunction } from 'express'

export const filterMiddleware = <T>(filterKeys: Array<keyof T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
}
