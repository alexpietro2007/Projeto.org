export default function criarChao(scene, arrayDoMapa) {
  const tamanhoBloco = 2; // O mesmo tamanho que você usou nas paredes

  // 1. Calcula as dimensões totais do mapa
  // Largura = quantidade de colunas (itens na primeira linha)
  const larguraTotal = arrayDoMapa[0].length * tamanhoBloco;
  // Profundidade = quantidade de linhas
  const profundidadeTotal = arrayDoMapa.length * tamanhoBloco;

  // 2. Cria o chão. (No CreateGround, 'height' representa o eixo Z / profundidade)
  const chao = BABYLON.MeshBuilder.CreateGround(
    "chao",
    {
      width: larguraTotal,
      height: profundidadeTotal,
    },
    scene,
  );

  // 3. Centraliza o chão embaixo do mapa
  // O Babylon cria formas a partir do centro (0,0). Como nosso loop desenha do 0
  // para a frente (+X e +Z), precisamos empurrar o chão para o meio do mapa.
  const centroX = larguraTotal / 2 - tamanhoBloco / 2;
  const centroZ = profundidadeTotal / 2 - tamanhoBloco / 2;

  chao.position = new BABYLON.Vector3(centroX, 0, centroZ);

  // 4. Ativa a colisão para a gravidade não puxar o jogador para o limbo
  chao.checkCollisions = true;

  // --- MATERIAL COM A SUA TEXTURA ---
  const matChao = new BABYLON.StandardMaterial("matChao_" + centroZ, scene);

  // URL da textura que você enviou
  matChao.diffuseTexture = new BABYLON.Texture(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIGG8kJ_N91hKSNTx0tKknO1Lmgc3F1M2QkfE2wUXugA&s=10",
    scene,
  );

  // Como essa imagem é pequena, precisamos repetir ela bastante para o chão não ficar com um quadradão esticado
  matChao.diffuseTexture.uScale = 8; // Repetição na largura
  matChao.diffuseTexture.vScale = 30; // Repetição no comprimento do corredor
  chao.material = matChao;
}
