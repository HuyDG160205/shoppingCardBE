/*
    //*làm backend thì kiểu gì cũng dựng server
*/
//* ts sẽ là ESModule build ra sẽ là commonjs

import express from 'express'
import userRouter from './routes/users.routers'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediaRouter from './routes/medias.routers'
import { initFolder } from './utils/file'
import staticRouter from './routes/static.routers'

const app = express()
const PORT = 3000
databaseServices.connect().catch(console.dir) //kết nối với mongodb
initFolder()
app.use(express.json()) //server dùng middleware biến đổi các chuỗi json được gửi lên trên
// cho server kết nối userRouter
app.use('/users', userRouter)
app.use('/medias', mediaRouter)
app.use('/static', staticRouter)
// cho server mở port ở 3000
app.use(defaultErrorHandler)
app.listen(PORT, () => {
  console.log('Server BE đang chạy trên port ' + PORT)
})
