import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import { USER_ROLE } from '~/constants/enums'
import { CreateBrandReqBody } from '~/models/requests/brands.requests'
import Brand from '~/models/schemas/Brand.schema'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { BRANDS_MESSAGES } from '~/constants/messages'

class BrandsServices {
  async isAdmin(user_id: string) {
    const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id), role: USER_ROLE.Admin })
    return Boolean(user)
  }
  async createBrand(brand: CreateBrandReqBody) {
    const brandInserted = await databaseServices.brands.insertOne(
      new Brand({
        ...brand
      })
    )
    return brandInserted
  }
  async getBrandById(id: string) {
    const brand = await databaseServices.brands.findOne({ _id: new ObjectId(id) })
    if (!brand) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: BRANDS_MESSAGES.BRAND_NOT_FOUND
      })
    }
    return brand
  }
  async getAllBrands() {
    const brands = await databaseServices.brands.find().toArray()
    return brands
  }
}

const brandsServices = new BrandsServices()
export default brandsServices
