import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI não definida em .env.local')
}

let isConnected = false

export const connectMongo = async (): Promise<void> => {
  if (isConnected) return

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'mozhost'
    })
    isConnected = true
    console.log('✅ Conectado ao MongoDB com Mongoose')
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error)
    throw error
  }
}
