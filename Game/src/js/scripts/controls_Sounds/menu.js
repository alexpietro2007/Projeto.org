const audio = document.getElementById('menu-som')
const slider = document.getElementById('volumeSlider')
let somTimeout = null

function atualizarAudioNoHardware(valor) {
    clearTimeout(somTimeout);
    // Aguarda 8 milissegundos de estabilização antes de alterar o hardware de som
    somTimeout = setTimeout(() => {
        audio.volume = valor / 100;
    }, 8);
    console.log("Entrei")
}
function pintarProgresso(valor) {
    slider.style.background = `linear-gradient(to right, #b48b11 0%, #f9df7b ${valor / 2}%, #b48b11 ${valor}%, #000000 ${valor}%, #000000 100%)`;
}
slider.addEventListener('input', (e) => {
    const valor = e.target.value;

    // Atualiza o som de forma suave em segundo plano
    pintarProgresso(valor)
    atualizarAudioNoHardware(valor);
});

