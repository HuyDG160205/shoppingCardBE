import HTTP_STATUS from '~/constants/httpStatus'
import { omit } from 'lodash'
import { NextFunction, Request, Response } from 'express'

export const defaultErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(error, ['status']))
}
