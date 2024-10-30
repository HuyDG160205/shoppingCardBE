/*
    //*làm backend thì kiểu gì cũng dựng server
*/
//* ts sẽ là ESModule build ra sẽ là commonjs

import express from 'express'
import userRouter from './routes/users.routers'
import databaseServices from './services/database.services'

const app = express()
const PORT = 3000
databaseServices.connect().catch(console.dir) //kết nối với mongodb

app.use(express.json()) //server dùng middleware biến đổi các chuỗi json được gửi lên trên
// cho server kết nối userRouter
app.use('/users', userRouter)
// http://localhost:3000/users/get-me/
// cho server mở port ở 3000
app.use((error, req, res, next) => {
  res.status(error.status).json(error)
})
app.listen(PORT, () => {
  console.log('Server BE đang chạy trên port ' + PORT)
})
