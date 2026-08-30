import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {connectDB} from './src/config/db.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../Game/')));
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '../Game/pages/index.html'))
})
app.get('/game', (req, res) =>{
    res.sendFile(path.join(__dirname, '../Game/pages/game.html'))
})


// Executa a conexão com o banco
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}/`);
});