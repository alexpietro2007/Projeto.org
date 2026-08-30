const novoJogo = document.getElementById('novoJogo')
const janela = document.getElementById('menu-novoJogo')
const fechar = document.getElementById('btn-fechar-modal')

novoJogo.addEventListener("click", () => {
  janela.showModal();
});

// Quando clicar em Voltar, FECHA a janela
fechar.addEventListener("click", () => {
  janela.close();
});