import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Brand from '~/models/schemas/Brand.schema'
import Category from '~/models/schemas/Category.schema'
import Product from '~/models/schemas/Product.schema'
dotenv.config() //kết nối vs file .env
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@shoppingcardprojectclus.rcvek.mongodb.net/?retryWrites=true&w=majority&appName=shoppingCardProjectCluster`

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  // accessor property
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refresh_tokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
  get brands(): Collection<Brand> {
    return this.db.collection(process.env.DB_BRANDS_COLLECTION as string)
  }
  get categories(): Collection<Category> {
    return this.db.collection(process.env.DB_CATEGORY_COLLECTION as string)
  }
  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTION as string)
  }

  //tạo index
  async indexUsers() {
    const exist = await this.users.indexExists(['_id_', 'username_1', 'email_1', 'email_1_password_1'])
    if (!exist) {
      await this.users.createIndex({ username: 1 }, { unique: true })
      await this.users.createIndex({ email: 1 }, { unique: true })
      await this.users.createIndex({ email: 1, password: 1 })
    }
  }
  async indexRefreshTokens() {
    const exist = await this.refresh_tokens.indexExists(['_id_', 'token_1', 'exp_1'])
    if (exist) return
    await this.refresh_tokens.createIndex({ token: 1 }, { unique: true })
    //TTL Index
    await this.refresh_tokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
  }
}
const databaseServices = new DatabaseServices()
export default databaseServices
