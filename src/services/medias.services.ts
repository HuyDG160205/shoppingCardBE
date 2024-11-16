import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFileName, handleuUploadImage, handleuUploadVideo } from '~/utils/file'
import fs from 'fs'
import { Media } from '~/models/Other'
import { mediaType } from '~/constants/enums'

class MediasServices {
  async handleUploadImage(req: Request) {
    const files = await handleuUploadImage(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newFileName = getNameFromFileName(file.newFilename) + '.jpg'
        //đường dẫn đến file mới
        const newPATH = UPLOAD_IMAGE_DIR + '/' + newFileName
        // dùng sharp để nén file lại và lưu vào newPath
        await sharp(file.filepath).jpeg().toFile(newPATH)
        //setup đường link
        fs.unlinkSync(file.filepath) //xóa hình cũ
        const url: Media = {
          url: `http://localhost:3000/static/image/${newFileName}`, //
          type: mediaType.Image
        }
        return url
      })
    )
    return result
  }

  //

  async handleUploadVideo(req: Request) {
    const files = await handleuUploadVideo(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const url: Media = {
          url: `http://localhost:3000/static/video/${file.newFilename}`, //
          type: mediaType.Video
        }
        return url
      })
    )
    return result
  }
}

const mediasServices = new MediasServices()
export default mediasServices
