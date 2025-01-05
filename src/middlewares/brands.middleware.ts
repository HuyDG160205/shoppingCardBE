import { checkSchema, ParamSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { BRANDS_MESSAGES } from '~/constants/messages'
import { REGEX_PHONE_NUMBER } from '~/constants/regex'
import { validate } from '~/utils/validate'

const idMongoSchema: ParamSchema = {
  notEmpty: {
    errorMessage: BRANDS_MESSAGES.ID_IS_REQUIRED
  },
  trim: true,
  custom: {
    options: (value: string) => {
      return ObjectId.isValid(value)
    },
    errorMessage: BRANDS_MESSAGES.ID_IS_INVALID
  }
}

const nameBrandSchema: ParamSchema = {
  notEmpty: {
    errorMessage: BRANDS_MESSAGES.BRAND_NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: BRANDS_MESSAGES.BRAND_NAME_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: { min: 1, max: 100 },
    errorMessage: BRANDS_MESSAGES.BRAND_NAME_LENGTH_MUST_BE_FROM_1_TO_100
  }
}

const numberPhoneSchema: ParamSchema = {
  notEmpty: {
    errorMessage: BRANDS_MESSAGES.HOTLINE_IS_REQUIRED
  },
  isString: {
    errorMessage: BRANDS_MESSAGES.HOTLINE_LENGTH_MUST_BE_FROM_1_TO_12
  },
  trim: true,
  isLength: {
    options: { min: 1, max: 12 },
    errorMessage: BRANDS_MESSAGES.HOTLINE_LENGTH_MUST_BE_FROM_1_TO_12
  },
  custom: {
    options: (value: string) => {
      return REGEX_PHONE_NUMBER.test(value)
    },
    errorMessage: BRANDS_MESSAGES.HOTLINE_IS_INVALID
  }
}

const addressBrandSchema: ParamSchema = {
  notEmpty: {
    errorMessage: BRANDS_MESSAGES.ADDRESS_IS_REQUIRED
  },
  isString: {
    errorMessage: BRANDS_MESSAGES.ADDRESS_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: { min: 1, max: 200 },
    errorMessage: BRANDS_MESSAGES.ADDRESS_LENGTH_MUST_BE_LESS_THAN_200
  }
}

export const createBrandValidator = validate(
  checkSchema(
    {
      name: nameBrandSchema,
      hotline: numberPhoneSchema,
      address: addressBrandSchema
    },
    ['body']
  )
)

export const idParamValidator = validate(
  checkSchema(
    {
      id: idMongoSchema
    },
    ['params']
  )
)
