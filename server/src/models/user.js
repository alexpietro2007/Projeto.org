import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Subdocumento dos Saves (os 3 slots do jogo)
const saveSchema = new mongoose.Schema({
  slotId: { type: Number, required: true, enum: [1, 2, 3] },
  nome: { type: String, default: 'Sobrevivente' },
  nivel: { type: Number, default: 1 },
  horas: { type: Number, default: 0 },
  minutos: { type: Number, default: 0 },
  posicao: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 2 },
    z: { type: Number, default: 0 }
  },
  mapaAtual: { type: Number, default: 0 }
}, { _id: false });

// Schema do Usuário
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Nome de usuário é obrigatório'], 
    unique: true,
    trim: true,
    minlength: 3
  },
  senha: { 
    type: String, 
    required: [true, 'Senha é obrigatória'],
    minlength: 6
  },
  saves: [saveSchema], // Inicializa como array vazio
  criadoEm: { type: Date, default: Date.now }
});

// Criptografa a senha antes de salvar no banco
userSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Método para verificar a senha na hora do Login
userSchema.methods.compararSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

export default mongoose.model('User', userSchema);