import mapaCorredor from "../maps/corredorInfin.js";

// 1. O GC agora é um Dicionário que sabe a posição de cada sala
const mapasAtivos = {};

export default function gerarMapa(scene, camera, arrayDoMapa, offsetZ = 0) {
  const tamanhoBloco = 2;
  const tamanhoDesteMapaZ = arrayDoMapa.length;

  // 2. Trava Genial: Se a sala dessa coordenada já existir, cancela a função!
  if (mapasAtivos[offsetZ]) {
    return;
  }

  const objetosDesteCorredor = [];

  // =====================================================
  // CRIAÇÃO DO CHÃO
  // =====================================================
  const larguraChao = arrayDoMapa[0].length * tamanhoBloco;
  const profundidadeChao = arrayDoMapa.length * tamanhoBloco;

  // Criação do chão
  const chao = BABYLON.MeshBuilder.CreateGround(
    "chao_" + offsetZ,
    { width: larguraChao, height: profundidadeChao },
    scene,
  );

  const centroX = larguraChao / 2 - tamanhoBloco / 2;
  const centroZ =
    offsetZ * tamanhoBloco + profundidadeChao / 2 - tamanhoBloco / 2;

  chao.position = new BABYLON.Vector3(centroX, 0, centroZ);
  chao.checkCollisions = true;

  // --- MATERIAL COM A SUA TEXTURA ---
  const matChao = new BABYLON.StandardMaterial("matChao_" + offsetZ, scene);

  // URL da textura que você enviou
  matChao.diffuseTexture = new BABYLON.Texture(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIGG8kJ_N91hKSNTx0tKknO1Lmgc3F1M2QkfE2wUXugA&s=10",
    scene,
  );

  // Como essa imagem é pequena, precisamos repetir ela bastante para o chão não ficar com um quadradão esticado
  matChao.diffuseTexture.uScale = 8; // Repetição na largura
  matChao.diffuseTexture.vScale = 30; // Repetição no comprimento do corredor

  chao.material = matChao;
  objetosDesteCorredor.push(chao);
  // =====================================================
  // 3. CRIAÇÃO DO TETO (Adicione logo abaixo do Chão)
  // =====================================================
  const larguraTeto = arrayDoMapa[0].length * tamanhoBloco;
  const profundidadeTeto = arrayDoMapa.length * tamanhoBloco;

  const teto = BABYLON.MeshBuilder.CreateGround(
    "teto_" + offsetZ,
    { width: larguraTeto, height: profundidadeTeto, updatable: false },
    scene,
  );

  // Altere para a altura exata do topo da sua parede (ex: 3.5 ou 5)
  const alturaTetoY = 4.9;

  const centroXTeto = larguraTeto / 2 - tamanhoBloco / 2;
  const centroZTeto =
    offsetZ * tamanhoBloco + profundidadeTeto / 2 - tamanhoBloco / 2;

  // Posiciona o teto lá em cima e inverte ele de cabeça para baixo (Math.PI)
  teto.position = new BABYLON.Vector3(centroXTeto, alturaTetoY, centroZTeto);
  teto.rotation.x = Math.PI;
  teto.checkCollisions = true;

  const matTeto = new BABYLON.StandardMaterial("matTeto_" + offsetZ, scene);

  const texturaTeto = new BABYLON.Texture(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIGG8kJ_N91hKSNTx0tKknO1Lmgc3F1M2QkfE2wUXugA&s=10",
    scene,
  );

  matTeto.diffuseTexture = texturaTeto;
  matTeto.emissiveTexture = texturaTeto; // <-- Isso faz a textura brilhar e aparecer mesmo sem luz no teto!

  matTeto.diffuseTexture.uScale = 8;
  matTeto.diffuseTexture.vScale = 30;

  teto.material = matTeto;
  objetosDesteCorredor.push(teto);

  // =====================================================
  // CRIAÇÃO DAS PAREDES E ÂNCORAS
  // =====================================================
  for (let z = 0; z < arrayDoMapa.length; z++) {
    for (let x = 0; x < arrayDoMapa[z].length; x++) {
      const idTile = arrayDoMapa[z][x];

      if (idTile === 0) continue;

      const posicaoZReal = (z + offsetZ) * tamanhoBloco;

      if (idTile === 1) {
        const parede = BABYLON.MeshBuilder.CreateBox(
          "parede",
          { height: 10, size: 2 },
          scene,
        );
        parede.position = new BABYLON.Vector3(
          x * tamanhoBloco,
          1,
          posicaoZReal,
        );
        parede.checkCollisions = true;

        // --- PINTURA DA PAREDE (TEXTURA) ---
        const matParede = new BABYLON.StandardMaterial(
          "matParede_" + offsetZ,
          scene,
        );

        // Cole o link da sua imagem de parede aqui (ou caminho local)
        matParede.diffuseTexture = new BABYLON.Texture(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxOVuD1jsCAYjWCWhJAKiv4XYMTqMh_R2IOhEE06OjzM5uJdfe4Y0Z984&s=10",
          scene,
        );

        // Repetição da textura na parede para não esticar
        matParede.diffuseTexture.uScale = 1.0;
        matParede.diffuseTexture.vScale = 1.0;

        parede.material = matParede;

        objetosDesteCorredor.push(parede);
      } else if (idTile === 2) {
        camera.position = new BABYLON.Vector3(
          x * tamanhoBloco,
          2,
          posicaoZReal,
        );
        camera.setTarget(
          new BABYLON.Vector3(x * tamanhoBloco, 2, posicaoZReal + 100),
        );
      } else if (idTile === 3 || idTile === 4) {
        const ancora = BABYLON.MeshBuilder.CreateSphere(
          "ancora",
          { diameter: 0.5 },
          scene,
        );
        ancora.position = new BABYLON.Vector3(
          x * tamanhoBloco,
          1,
          posicaoZReal,
        );
        ancora.isVisible = false; // Mude para false depois

        // Colocamos a âncora na lista para ela ser apagada com a sala
        objetosDesteCorredor.push(ancora);

        // 3. O observador da âncora agora é blindado
        const observer = scene.onBeforeRenderObservable.add(() => {
          // Se a âncora já foi deletada pelo Garbage Collector, destrói o observador
          if (ancora.isDisposed()) {
            scene.onBeforeRenderObservable.remove(observer);
            return;
          }

          if (BABYLON.Vector3.Distance(camera.position, ancora.position) < 6) {
            let novoOffsetZ =
              idTile === 3
                ? offsetZ + tamanhoDesteMapaZ
                : offsetZ - tamanhoDesteMapaZ;

            // Só chama a função se o mapa da frente (ou de trás) não existir ainda
            if (!mapasAtivos[novoOffsetZ]) {
              gerarMapa(scene, camera, mapaCorredor, novoOffsetZ);
            }
          }
        });
      }
    }
  }

  // =====================================================
  // O NOVO GARBAGE COLLECTOR (GC ESPACIAL)
  // =====================================================

  // Salva esta sala no dicionário usando o offsetZ como "Chave"
  mapasAtivos[offsetZ] = objetosDesteCorredor;

  // Distância máxima permitida para manter um mapa vivo (Mantém ~3 salas ao seu redor)
  const limiteDistancia = tamanhoDesteMapaZ * 2.5;

  Object.keys(mapasAtivos).forEach((chaveStr) => {
    const offsetGravado = parseInt(chaveStr);

    // Se a sala estiver muito longe da sala que acabamos de gerar, delete-a
    if (Math.abs(offsetGravado - offsetZ) > limiteDistancia) {
      console.log("GC Apagou a sala na posição:", offsetGravado);

      // Deleta todas as paredes, chão e âncoras da sala antiga
      mapasAtivos[offsetGravado].forEach((objeto) => {
        objeto.dispose();
      });

      // Remove do dicionário
      delete mapasAtivos[offsetGravado];
    }
  });
}
