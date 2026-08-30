const audio = document.getElementById('menu-som');
const slider = document.getElementById('volumeSlider');
let somTimeout = null;

function atualizarAudioNoHardware(valor) {
    clearTimeout(somTimeout);
    // Aguarda 8 milissegundos de estabilização antes de alterar o hardware de som
    somTimeout = setTimeout(() => {
        if (audio) audio.volume = valor / 100;
    }, 8);
}

function pintarProgresso(valor) {
    slider.style.background = `linear-gradient(to right, #b48b11 0%, #f9df7b ${valor / 2}%, #b48b11 ${valor}%, #000000 ${valor}%, #000000 100%)`;
}

// 1. Toca o áudio no primeiro clique na tela (Garante a liberação do navegador)
document.addEventListener('click', () => {
    if (audio && audio.paused) {
        audio.play();
        audio.volume = slider.value / 100; // Sincroniza com o valor atual do slider
    }
}, { once: true });

// 2. Atualiza em tempo real enquanto o jogador arrasta
slider.addEventListener('input', (e) => {
    const valor = e.target.value;
    pintarProgresso(valor);
    atualizarAudioNoHardware(valor);
});

// 3. Pinta o slider no valor inicial (30) assim que o script carrega
if (slider) {
    pintarProgresso(slider.value);
}