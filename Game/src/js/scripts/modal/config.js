const engrenagem = document.getElementById("btn-config");
const janelaConfig = document.getElementById("menu-config");
const btnFechar = document.getElementById("fechar-config");

// Quando clicar na engrenagem, ABRE a janela como modal (por cima de tudo)
engrenagem.addEventListener("click", () => {
  janelaConfig.showModal();
});

// Quando clicar em Voltar, FECHA a janela
btnFechar.addEventListener("click", () => {
  janelaConfig.close();
});
