import express, { Router } from 'express'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { serveImageController, serveVideoController } from '~/controllers/static.controllers'
import { wrapAsync } from '~/utils/handlers'
const staticRouter = Router()

// staticRouter.use('/image', express.static(UPLOAD_IMAGE_DIR))
staticRouter.get('/image/:namefile', wrapAsync(serveImageController))
// staticRouter.use('/video', express.static(UPLOAD_VIDEO_DIR))
staticRouter.get('/video/:namefile', wrapAsync(serveVideoController))

//namefile là params

export default staticRouter
