import path from 'path'
import fs from 'fs' //module chứa các method xử lý file
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { NextFunction, Request, Response } from 'express'
import formidable, { File } from 'formidable'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // cho phép tạo lòng các thư mục
      })
    }
  })
  //nếu mà tìm k được thì tạo mới thu mục
}

//tạo hàm handleuUploadImage hàm nhận vào req
// ép req phải đi qua tấm lưới lọc formidable
// từ đó lấy được các file trong request , chỉ chọn ra các file là image
// return các file đó ra ngoài

export const handleuUploadImage = async (req: Request) => {
  // tạo lưới lọc từ formiadle
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4, // tối đa 4 hình thôi
    maxFileSize: 300 * 1024, // 300kb
    maxTotalFileSize: 300 * 1024 * 4,
    keepExtensions: true, // gữi lãi đuôi của file
    filter: ({ name, originalFilename, mimetype }) => {
      //name: là field dc gửi thông qua form <input name="fileNe">
      //originalFileName: tên gốc của file
      //mimetype: kiểu định dạng file 'video/mp4' 'video/mkv' 'image/png' 'image/jpeg'
      const valid = name === 'image' && Boolean(mimetype?.includes('image'))
      if (!valid) {
        form.emit('error' as any, new Error('File Type Invalid !!!') as any)
      }

      return valid
    }
  })
  //có lưới rồi thì ep req vào
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      if (!files.image) return reject(new Error('Image is empty'))
      return resolve(files.image)
    })
  })
}

export const handleuUploadVideo = async (req: Request) => {
  // tạo lưới lọc từ formiadle
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1, // tối đa 1 hình thôi
    maxFileSize: 50 * 1024 * 1024, // 50mb
    keepExtensions: true, // gữi lãi đuôi của file
    filter: ({ name, originalFilename, mimetype }) => {
      //name: là field dc gửi thông qua form <input name="fileNe">
      //originalFileName: tên gốc của file
      //mimetype: kiểu định dạng file 'video/mp4' 'video/mkv' 'image/png' 'image/jpeg'
      const valid = name === 'video' && Boolean(mimetype?.includes('video'))
      if (!valid) {
        form.emit('error' as any, new Error('File Type Invalid !!!') as any)
      }

      return valid
    }
  })
  //có lưới rồi thì ep req vào
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      if (!files.video) return reject(new Error('Video is empty'))
      return resolve(files.video)
    })
  })
}

//viết hàm nhận vào fullFileName và chỉ lấy tên bỏ đuôi
// anh1png
export const getNameFromFileName = (fileName: string) => {
  const nameArr = fileName.split('.')
  nameArr.pop()
  return nameArr.join('-')
}
