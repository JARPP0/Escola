function error(msg){
    gsap.fromTo(`fieldset`, {
        border: `2px solid rgba(255, 199, 146, 0.483)`
    }, {
        border: `2px solid rgba(255, 255, 255, 0.1)`
    })
    document.querySelector(`#error`).innerHTML = msg
}
let verifyEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

document.querySelector(`form`).addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector(`[name='name']`).value
    const email = document.querySelector(`[name='email']`).value
    const pass = document.querySelector(`[name='password']`).value
    const conf = document.querySelector(`[name='confirm']`).value

    if(!name) error("Falta um nome")
    else if(!email) error("Falta um email")
    else if(!pass) error("Falta a senha")
    else if(!conf) error("Falta a confirmação de senha")
    else if(!verifyEmail.test(email)) error("Email inválido")
    else if(pass !== conf) error("Senhas não coincidem")
    else{
        window.location.href = `/Escola/Explain/explain.html`
    }
});
