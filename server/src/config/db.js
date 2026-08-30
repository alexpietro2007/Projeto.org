import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro na conexão: ${error.message}`);
    process.exit(1); // Encerra a aplicação em caso de falha grave
  }
};