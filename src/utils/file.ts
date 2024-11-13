import path from 'path'
import fs from 'fs' //module chứa các method xử lý file

export const initFolder = () => {
  //lưu đường dẫn đến thư mục sẽ lưu file
  const uploadsFolderPath = path.resolve('uploads')
  //truy vết đường link này xem có đến được thư mục nào ko ?
  //nếu mà tìm k được thì tạo mới thu mục
  if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath, {
      recursive: true // cho phép tạo lòng các thư mục
    })
  }
}
