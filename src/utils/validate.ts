// viết hàm validate nhận vào checkSchema
// hàm sẽ trả ra middleware xử lý lỗi
// ai gọi validate(checkSchema) nhận được middleWare
import { Request, Response, NextFunction } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) //ghi lỗi và request
    const errors = validationResult(req) //lấy lỗi trong request
    if (errors.isEmpty()) {
      return next()
    } else {
      res.status(422).json({
        message: 'Invalid Value',
        errors: errors.mapped()
      })
    }
  }
}
