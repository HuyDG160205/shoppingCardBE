import express from 'express'
import { createBrandController, getAllBrandController, getBrandByIdController } from '~/controllers/brands.controllers'
import { createBrandValidator, idParamValidator } from '~/middlewares/brands.middleware'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const brandRouter = express.Router()
/*
    desc: create a brand
    method: POST
    path: /brands/
    Header:{
        Authorization: Bearer <access_token>
    }
    body: {
        name: string
        hotline: string,
        address: string
    }
*/
brandRouter.post(
  '/',
  accessTokenValidator, //
  createBrandValidator,
  wrapAsync(createBrandController)
)

/*
    dsec: get infor of brand by id
    method: GET
    path /brands/:id
*/
brandRouter.get('/:id', idParamValidator, wrapAsync(getBrandByIdController))

/*
    desc: get all brands
    method: GET
    path: /brands
*/
brandRouter.get('/', wrapAsync(getAllBrandController))

export default brandRouter
