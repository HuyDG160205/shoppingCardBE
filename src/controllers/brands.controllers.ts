import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { BRANDS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { CreateBrandReqBody, getBrandReqParams } from '~/models/requests/brands.requests'
import { TokenPayLoad } from '~/models/requests/users.requests'
import brandsServices from '~/services/brands.services'

export const createBrandController = async (
  req: Request<ParamsDictionary, any, CreateBrandReqBody>,
  res: Response,
  next: NextFunction
) => {
  //người dùng phải là admin thì mới được dùng tính năng này
  const { user_id } = req.decode_authorization as TokenPayLoad
  //tìm user xem phải admin không?
  const isAdmin = await brandsServices.isAdmin(user_id)
  if (!isAdmin) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.FORBIDDEN,
      message: USERS_MESSAGES.USER_IS_NOT_ADMIN
    })
  }

  const brand = await brandsServices.createBrand(req.body)
  res.status(HTTP_STATUS.CREATED).json({ message: BRANDS_MESSAGES.CREATE_BRAND_SUCCESS, result: brand })
}

export const getBrandByIdController = async (
  req: Request<getBrandReqParams, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const brand = await brandsServices.getBrandById(id)
  res.status(HTTP_STATUS.OK).json({
    message: BRANDS_MESSAGES.GET_BRAND_SUCCESS, //
    result: brand
  })
}

export const getAllBrandController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const brands = await brandsServices.getAllBrands()
  res.status(HTTP_STATUS.OK).json({ message: BRANDS_MESSAGES.GET_BRANDS_SUCCESS, result: brands })
}
