import { ParamsDictionary } from 'express-serve-static-core'

export interface CreateBrandReqBody {
  name: string
  hotline: string
  address: string
}

export interface getBrandReqParams extends ParamsDictionary {
  id: string
}
