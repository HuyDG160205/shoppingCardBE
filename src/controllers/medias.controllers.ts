import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import path from 'path'
import formidable from 'formidable'
import { getNameFromFileName, handleuUploadSingleImage } from '~/utils/file'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import sharp from 'sharp'

export const uploadSingleImageController = async (
  req: Request,
  res: Response, //
  next: NextFunction
) => {
  const file = await handleuUploadSingleImage(req)
  const newFileName = getNameFromFileName(file.newFilename) + '.jpg'
  //đường dẫn đến file mới
  const newPATH = UPLOAD_IMAGE_DIR + '/' + newFileName
  // dùng sharp để nén file lại và lưu vào newPath
  await sharp(file.filepath).jpeg().toFile(newPATH)
  //setup đường link
  const url = `http://localhost:3000/static/image/${newFileName}`

  res.status(HTTP_STATUS.OK).json({
    message: 'Upload image successfully',
    url
  })
}
