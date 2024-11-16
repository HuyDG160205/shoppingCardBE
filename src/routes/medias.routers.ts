import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'
import { wrapAsync } from '~/utils/handlers'
const mediaRouter = Router()

//route giúp người dùng upload 1 bức hình
mediaRouter.post('/upload-image', wrapAsync(uploadSingleImageController))

export default mediaRouter
