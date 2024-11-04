import HTTP_STATUS from '~/constants/httpStatus'
import { omit } from 'lodash'
import { NextFunction, Request, Response } from 'express'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  //lỗi của toàn bộ hệ thống sẽ đổ về đây
  if (error instanceof ErrorWithStatus) {
    res.status(error.status).json(omit(error, ['status']))
  } else {
    // lỗi khác ErrorWithSatus, nghỉa là lỗi bthg, lỗi k có status,
    // lỗi có tùm lum thứ
    Object.getOwnPropertyNames(error).forEach((key) => {
      Object.defineProperty(error, key, {
        enumerable: true
      })
      //
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        errorInfor: omit(error, ['stack'])
      })
    })
  }
}
