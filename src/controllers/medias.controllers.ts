import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import path from 'path'
import formidable from 'formidable'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  //__dirname: đường dẫn đến folder chứa file này
  //path.resolve('uploads'): là đường dẫn mà mình mong muốn lưu file vào
  //setup tấm lưới chặn
  const form = formidable({
    maxFiles: 1, //tối đa 1 file thoi
    maxFileSize: 300 * 1024, // 300kb
    keepExtensions: true, // giữ lại đuôi của file
    uploadDir: path.resolve('uploads')
  })

  //ep req phải đi qua lưới
  form.parse(req, (err, fields, files) => {
    if (err) throw err
    else {
      // xử lý file
      res.status(HTTP_STATUS.OK).json({
        message: 'upload image successfully'
      })
    }
  })
}
