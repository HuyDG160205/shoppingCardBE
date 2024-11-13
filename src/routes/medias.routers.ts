import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'
const mediaRouter = Router()

//route giúp người dùng upload 1 bức hình
mediaRouter.post('/upload-image', uploadSingleImageController)

export default mediaRouter
