const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
import mapaCorredorSpawn from "./maps/corredorSpawn.js";
import gerarMapa from "./functions/gerarMapa.js";
import criarChao from "./functions/criarChao.js";



const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  // 1. Ativa o sistema de colisões e gravidade do motor
  scene.collisionsEnabled = true;
  scene.gravity = new BABYLON.Vector3(0, -0.15, 0);

  // Luz básica
  const light = new BABYLON.HemisphericLight(
    "luz",
    new BABYLON.Vector3(0, 1, 0),
    scene,
  );
  scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
  const corNevoa = new BABYLON.Color3(0.1, 0.1, 0.1);
  scene.fogColor = corNevoa;

  // 2. Cria a Câmera FPS (Universalplayer)
  const player = new BABYLON.UniversalCamera(
    "fpscamera",
    new BABYLON.Vector3(0, 2, -5),
    scene,
  );
  player.minZ = 0.01;
  player.fov = BABYLON.Tools.ToRadians(90);
  player.attachControl(canvas, true);
  scene.clearColor = corNevoa;
  // 3. Configura as distâncias (em blocos/unidades 3D)
  scene.fogStart = 2.0; // A que distância do jogador a névoa começa
  scene.fogEnd = 5.0; // A que distância fica impossível ver qualquer coisa
  // Configurações de colisão e física da câmera
  player.checkCollisions = true;
  player.applyGravity = true;
  player.ellipsoid = new BABYLON.Vector3(0.8, 1.5, 0.8); // Hitbox do jogador (X, Y, Z)
  player.speed = 0.3;
  player.angularSensibility = 5000;

  // Mapeia WASD para movimentação (por padrão o Babylon usa as setas)
  player.keysUp.push(87); // W
  player.keysDown.push(83); // S
  player.keysLeft.push(65); // A
  player.keysRight.push(68); // D
  gerarMapa(scene, player, mapaCorredorSpawn);
  criarChao(scene, mapaCorredorSpawn);

  return scene;
};

const scene = createScene();

// 5. Trava o cursor (Pointer Lock) ao clicar na tela
canvas.addEventListener("click", () => {
  engine.enterPointerlock();
});

// Loop de renderização
engine.runRenderLoop(() => {
  scene.render();
});

// Ajusta o canvas se a janela for redimensionada
window.addEventListener("resize", () => {
  engine.resize();
});
