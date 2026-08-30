// Importa o Axios via CDN (se estiver usando Vite/NPM, use: import axios from 'axios';)
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm';

const fechar = document.getElementById('btn-fechar-novoJogo');
const modal = document.getElementById('menu-novoJogo');
const btnAbrirModal = document.getElementById('novoJogo');

function gerarCartaoSave(nome, nivel, horas, minutos) {
  // ... (Mantenha a função gerarCartaoSave que já fizemos exatamente igual)
  const botao = document.createElement('button');
  botao.className = 'btn-padrao cartao-save';
  botao.innerHTML = `
    <div class="perfil-esquerda">
      <div class="avatar-circulo"></div>
      <span class="nome-jogador">${nome}</span>
    </div>
    <div class="status-direita">
      <span class="nivel-texto">Nivelº ${nivel}</span>
      <div class="tempo-badge">Hrs:${horas} Min:${minutos}</div>
    </div>
  `;
  return botao;
}

async function carregarSlotsDeSave() {
  const container = document.getElementById('container-saves');
  container.innerHTML = '<p style="color: #fff; text-align: center;">Buscando saves no servidor...</p>';
  
  try {
    // 1. GET COM AXIOS: Busca os 3 slots formatados do backend
    // Assumindo que sua API Node esteja na porta 3000
    const resposta = await axios.get('http://localhost:3000/user/saves/');
    const savesDoBanco = resposta.data; // O Axios já converte para JSON!

    container.innerHTML = ''; 

    for (let i = 0; i < 3; i++) {
      const dadosSave = savesDoBanco[i];
      const numeroSlot = i + 1;

      if (dadosSave) {
        // SLOT OCUPADO
        const cartao = gerarCartaoSave(dadosSave.nome, dadosSave.nivel, dadosSave.horas, dadosSave.minutos);
        
        cartao.addEventListener('click', () => {
          window.location.href = `./game.html?slot=${numeroSlot}`;
        });
        
        container.appendChild(cartao);

      } else {
        // SLOT VAZIO
        const btnNovoJogo = document.createElement('button');
        btnNovoJogo.className = 'btn-padrao';
        btnNovoJogo.textContent = 'Novo Jogo';
        
        btnNovoJogo.addEventListener('click', async () => {
          try {
            // 2. POST COM AXIOS: Cria um novo save no banco
            // Enviamos um objeto {} que o Axios automaticamente transforma em JSON no Body
            await axios.post('http://localhost:3000/api/saves/novo', {
              slotSelecionado: numeroSlot
            });
            
            // Vai para o jogo só se o POST der sucesso
            window.location.href = `./game.html?slot=${numeroSlot}&novo=true`;
            
          } catch (erroCriacao) {
            console.error("Falha ao criar o jogo:", erroCriacao);
            alert("Não foi possível criar o save. Verifique a conexão.");
          }
        });
        
        container.appendChild(btnNovoJogo);
      }
    }
  } catch (erro) {
    console.error("Erro ao buscar saves:", erro);
    // Se o Axios cair no catch, você pode ler a resposta de erro do servidor assim:
    // console.log(erro.response?.data);
    
    container.innerHTML = '<p style="color: #ff4d4d;">Erro ao carregar os dados do banco.</p>';
  }
}

btnAbrirModal.addEventListener('click', () => {
   modal.showModal(); 
   carregarSlotsDeSave();
});

fechar.addEventListener("click", () => {
  modal.close();
});