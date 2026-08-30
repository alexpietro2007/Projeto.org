const openModal = document.getElementById('login')
const closeModal = document.getElementById('modal-fechar-login')
const modalLogin = document.getElementById('modal-login')

openModal.addEventListener(('click'), () =>{
    modalLogin.showModal();
})

closeModal.addEventListener(('click'), () =>{
    modalLogin.close();
})