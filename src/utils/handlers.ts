// file này lưu hàm wrapAsync
// wrapAsync nhận vào 'Request Handler A'
// sau đó trả ra 'Request Handler B' có cấu trúc try catch next
// vạy chạy 'Request Handler A' bên trong try

import { NextFunction, Request, RequestHandler, Response } from 'express'

export const wrapAsync = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
