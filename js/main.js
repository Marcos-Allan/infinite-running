// VARIABLES LOGIN
const screen_login = document.querySelector('.entrance')
const login_form = document.querySelector('.login_form')
const login_input = document.querySelector('.login_input')
const login_button = document.querySelector('.login_button')

// VARIABLES CONTROLS
const screen_game = document.querySelector('.game')
const controls = document.querySelector('.controls')
const jump_btn = document.querySelector('.jump')
const fall_btn = document.querySelector('.fall')
const name_player = document.querySelector('.name_player')

// PLAYER VARIABLE
const player = document.querySelector('.player') 

// LOGIN VALIDATION
function checkDisabledInput(){
    if(login_input.value.trim().length >= 3){
        login_button.removeAttribute('disabled')
    }else{
        login_button.setAttribute('disabled', 'true')
    }
}

login_input.addEventListener('input', checkDisabledInput)

login_form.addEventListener('submit', (e) => {
    e.preventDefault()
    screen_login.style.display = 'none'
    name_player.innerText = login_input.value
    //LEVAR O PLAYER A TELA DO JOGO
    screen_game.style.display = 'block'
})

// FUNCTION INTERATIONS
function jump_player(){
    jump_btn.removeEventListener('click', jump_player)
    document.removeEventListener('keyup', getTeclaUp)
    player.classList.remove('fall_animation')
    player.classList.add('jump_animation')
    setTimeout(() => {
        player.classList.remove('jump_animation')
        jump_btn.addEventListener('click', jump_player)
        document.addEventListener('keyup', getTeclaUp)
    }, 1000);
}

function fall_player(){
    fall_btn.removeEventListener('click', fall_player)
    document.removeEventListener('keydown', getTeclaDown)
    player.classList.remove('jump_animation')
    player.classList.add('fall_animation')
    setTimeout(() => {
        player.classList.remove('fall_animation')
        fall_btn.addEventListener('click', fall_player)
        document.addEventListener('keydown', getTeclaDown)
    }, 1000);
}

function getTeclaUp(event){
    let codigoTecla = event.keyCode || event.which;
    if(codigoTecla == 38){
        jump_player()
    }
}

function getTeclaDown(event){
    let codigoTecla = event.keyCode || event.which;
    if(codigoTecla == 40){
        fall_player()
    }
}

// INTERATIONS BUTTONS
jump_btn.addEventListener('click', jump_player)
fall_btn.addEventListener('click', fall_player)
document.addEventListener('keyup', getTeclaUp)
document.addEventListener('keydown', getTeclaDown)
