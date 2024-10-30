// viết hàm validate nhận vào checkSchema
// hàm sẽ trả ra middleware xử lý lỗi
// ai gọi validate(checkSchema) nhận được middleWare
import { Request, Response, NextFunction } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) //ghi lỗi và request
    const errors = validationResult(req) //lấy lỗi trong request
    if (errors.isEmpty()) {
      return next()
    } else {
      const errorObject = errors.mapped()
      const entityError = new EntityError({ errors: {} })
      for (const key in errorObject) {
        const { msg } = errorObject[key]
        if (msg instanceof ErrorWithStatus && msg.status != HTTP_STATUS.UNPROCESSABLE_ENTITY) {
          return next(msg)
        }
        entityError.errors[key] = msg
      }
      next(entityError)
    }
  }
}
