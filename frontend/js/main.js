// IMPORTAÇÕES
import { app, auth, provider, signInWithPopup } from '../js/firebase.js'

// VARIABLES LOGIN
const screen_login = document.querySelector('.entrance')
const login_form = document.querySelector('.login_form')
const login_input = document.querySelector('.login_input')
const login_button = document.querySelector('.login_button')

login_button.addEventListener('mouseenter', () => {
    if(login_button.disabled){
        return
    }else{
        login_button.style.scale = '1.1'
    }
})

login_button.addEventListener('mouseleave', () => {
    if(login_button.disabled){
        return
    }else{
        login_button.style.scale = '1'
    }
})

// VARIABLES GAME CONTROLS
const screen_game = document.querySelector('.game')
const controls = document.querySelector('.controls')
const jump_btn = document.querySelector('.jump')
const fall_btn = document.querySelector('.fall')
const name_player = document.querySelector('.name_player')

// GOOGLE VARIABLES LOGIN
const login_google = document.querySelector('.login_google')
const icon_google = document.querySelector('.icon_google')
const message_google = document.querySelector('.message_google')
const perfil_name = document.querySelector('.perfil_name')
const perfil_img = document.querySelector('.perfil_img')
const game_icon = document.querySelector('.game_icon')

// WAITING VARIABLES
const screen_waiting = document.querySelector('.waiting')
const screen_message = document.querySelector('.message')
let num = 6
let reg;
let loop;
let timer;
let timeout;
let websocket;
let names = []
let red;
let green;
let blue;
let rgbColor;

// GAME VARIABLE
const play_again = document.querySelector('.play_again')
const player = document.querySelector('.player') 
const enemy = document.querySelector('.enemy') 
const placar = document.querySelector('.placar')
let winner;
let loser;

document.addEventListener('DOMContentLoaded',view_user)

const userSignIn = async() => {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user
        sessionStorage.setItem('user', JSON.stringify({name: result.user.displayName.split(' ')[0], img: result.user.photoURL}))

        view_user()

    }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.mesage
    })
}

function hacker(){

    function changeColor() {
        red = Math.floor(Math.random() * 256);
        green = Math.floor(Math.random() * 256);
        blue = Math.floor(Math.random() * 256);
      
        rgbColor = "rgb(" + red + ", " + green + ", " + blue + ")"
        
        player.style.backgroundColor = rgbColor
      }

    if(name_player.innerText.toLowerCase() == 'hacker' || name_player.innerText.toLowerCase() == 'hack'){
        setInterval(changeColor, 250);
        player.style.bottom = 'calc(100% - 51px)'
        player.style.border = '1px solid var(--color1)'
        // player.style.backgroundColor = rgbColor
        jump_btn.removeEventListener('click', jump_player)
        fall_btn.removeEventListener('click', fall_player) 
        document.removeEventListener('keyup', get_tecla_up)
        document.removeEventListener('keydown', get_tecla_down)
    }else{
        return
    }
}

function view_user(){
    const user = sessionStorage.getItem('user')
    if(user){
        icon_google.style.display = 'none'
        message_google.style.display = 'none'
    
        perfil_name.style.display = 'block'
        perfil_img.style.display = 'block'
        perfil_name.innerText = JSON.parse(sessionStorage.getItem('user')).name
        perfil_img.src = `${JSON.parse(sessionStorage.getItem('user')).img}`
        
        login_input.value = JSON.parse(sessionStorage.getItem('user')).name
        check_disabled_input()
        login_input.focus()
        env_form()
    }else{
        icon_google.style.display = 'block'
        message_google.style.display = 'block'
    
        perfil_name.style.display = 'none'
        perfil_img.style.display = 'none'
    }
}

icon_google.addEventListener('click', userSignIn)

icon_google.addEventListener('mouseenter', () => {
    message_google.classList.remove('animate_back')
    message_google.classList.add('animate_entrance')
})

icon_google.addEventListener('mouseleave', () => {
    message_google.classList.remove('animate_entrance')
    message_google.classList.add('animate_back')
})

// LOGIN VALIDATION
function check_disabled_input(){
    if(login_input.value.trim().length >= 3){
        login_button.removeAttribute('disabled')
        login_input.style.border = '1px solid var(--color4)'
    }else{
        login_button.setAttribute('disabled', 'true')
        login_button.style.scale = '1'
        login_input.style.border = '1px solid var(--color2F)'
    }
}

login_input.addEventListener('input', check_disabled_input)

login_form.addEventListener('submit', env_form)

// FUNCTION INTERATIONS
function capitalizeWords(str) {
    return str.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });
}

function env_form(e){
    e.preventDefault()
    websocket = new WebSocket('wss://backend-infinite-runing.onrender.com')
    
    websocket.addEventListener('open', () => {
        websocket.send(JSON.stringify({ name: login_input.value, loser: '', winner: '' }))
    })

    websocket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data)

        if(data.peoples == '1' && JSON.parse(data.data) == 1001){
            num = 6
            timer = 6
            clearInterval(reg)
            clearTimeout(timeout)
            screen_waiting.style.display = 'flex'
            screen_message.innerText = `${data.peoples == '1' ? `Só há você online` : `tem ${data.peoples} pessoas online`}`
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            game_icon.style.display = 'none'
            return
        }

        if(data.peoples == '2' && JSON.parse(data.data) != 1001 && JSON.parse(data.data).loser == '' && JSON.parse(data.data).winner == ''){
            screen_waiting.style.display = 'flex'
                reg = setInterval(() => {
                    num--
                    icon_google.style.display = 'none'
                    message_google.style.display = 'none'
                    game_icon.style.display = 'none'
                    screen_message.innerText = `O Jogo Começa Em ${num}`
                }, 1000);
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            game_icon.style.display = 'none'
            timeout = setTimeout(() => {
                screen_waiting.style.display = 'none'
                screen_login.style.display = 'none'
                game_icon.style.display = 'none'
                name_player.innerText = login_input.value
                //LEVAR O PLAYER A TELA DO JOGO
                screen_game.style.display = 'block'
                play_game()
            }, 6000);
        }
        
        if(JSON.parse(data.data).loser == '' && JSON.parse(data.data).winner == ''){
            screen_waiting.style.display = 'flex'
            screen_message.innerText = `${data.peoples == '1' ? `Só Há Você Online` : `Tem ${data.peoples} Pessoas Online`}`
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            icon_google.style.display = 'none'
            message_google.style.display = 'none'
            game_icon.style.display = 'none'
            return
        }else if(JSON.parse(data.data).loser != name_player.innerText){
            websocket.send(JSON.stringify({ winner: name_player.innerText, loser: JSON.parse(data.data).winner }))
            
            names.push(data.names.split(': ')[1].replace(',2','').toLowerCase())
            names.push(data.names.split(': ')[2].replace(',2','').toLowerCase())
            
            const list = names.filter(nome => nome !== name_player.innerText.toLowerCase());

            loser = list[0]

            websocket.close()
            
            name_player.innerText = ''
            screen_waiting.style.display = 'flex'
            game_icon.style.display = 'block'
            play_again.style.display = 'block'
            play_again.style.backgroundColor = 'var(--color5)'
            screen_message.innerHTML = `Vc Ganhou <br> ${capitalizeWords(loser)} Perdeu`
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            icon_google.style.display = 'none'
            message_google.style.display = 'none'
            return
        }else if(JSON.parse(data.data).loser == name_player.innerText){
            websocket.send(JSON.stringify({ loser: name_player.innerText, winner: JSON.parse(data.data).winner }))
                
            names.push(data.names.split(': ')[1].replace(',2','').toLowerCase())
            names.push(data.names.split(': ')[2].replace(',2','').toLowerCase())
            
            const list = names.filter(nome => nome !== name_player.innerText.toLowerCase());

            winner = list[0]

            websocket.close()
            name_player.innerText = ''
            screen_waiting.style.display = 'flex'
            game_icon.style.display = 'block'
            play_again.style.display = 'block'
            play_again.style.backgroundColor = 'var(--color2)'
            screen_message.innerHTML = `Vc Perdeu <br>${capitalizeWords(winner)} Ganhou`
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            icon_google.style.display = 'none'
            message_google.style.display = 'none'
            return
        }
    })
}

function jump_player(){
    jump_btn.removeEventListener('click', jump_player)
    document.removeEventListener('keyup', get_tecla_up)
    player.classList.remove('fall_animation')
    player.classList.add('jump_animation')
    setTimeout(() => {
        player.classList.remove('jump_animation')
        jump_btn.addEventListener('click', jump_player)
        document.addEventListener('keyup', get_tecla_up)
    }, 1000);
}

function fall_player(){
    fall_btn.removeEventListener('click', fall_player)
    document.removeEventListener('keydown', get_tecla_down)
    player.classList.remove('jump_animation')
    player.classList.add('fall_animation')
    setTimeout(() => {
        player.classList.remove('fall_animation')
        fall_btn.addEventListener('click', fall_player)
        document.addEventListener('keydown', get_tecla_down)
    }, 1000);
}

function get_tecla_up(event){
    let codigoTecla = event.keyCode || event.which;
    if(codigoTecla == 38){
        jump_player()
    }
}

function get_tecla_down(event){
    let codigoTecla = event.keyCode || event.which;
    if(codigoTecla == 40){
        fall_player()
    }
}

function game_over(pos_player, pos_enemy){
    websocket.send(JSON.stringify({
        loser: name_player.innerText,
        winner: ''
    }))

    //REMOVE OS MOVIMENTOS DO PLAYER
    jump_btn.removeEventListener('click', jump_player)
    fall_btn.removeEventListener('click', fall_player) 
    document.removeEventListener('keyup', get_tecla_up)
    document.removeEventListener('keydown', get_tecla_down)

    //LIMPA O LOOP DO JOGO
    clearInterval(loop)

    //PARA TODAS AS ANIMAÇÕES
    player.classList.remove('jump_animation')
    player.classList.remove('fall_animation')
    enemy.classList.remove('face_animation')

    //TRAVA AS POSIÇÕES DAS ENTIDADES
    player.style.left = `${pos_player.left}px`
    enemy.style.left = `${pos_enemy.left}px`

    //REDIRECIONAMENTO PARA JOGAR NOVAMENTE
    screen_login.style.display = 'block'
    //LEVAR O PLAYER A TELA DO JOGO
    screen_game.style.display = 'none'
    // login_input.value = ''
    // login_input.focus()
    // play_game()
}

// ADD INTERATIONS BUTTONS
play_again.addEventListener('click', () => {
    window.location.reload()
})
jump_btn.addEventListener('click', jump_player)
fall_btn.addEventListener('click', fall_player) 
document.addEventListener('keyup', get_tecla_up)
document.addEventListener('keydown', get_tecla_down)


//LÓGICA DO JOGO
function play_game(){
    jump_btn.addEventListener('click', jump_player)
    fall_btn.addEventListener('click', fall_player) 
    document.addEventListener('keyup', get_tecla_up)
    document.addEventListener('keydown', get_tecla_down)

    clearInterval(reg)
    login_button.setAttribute('disabled', 'true')
    enemy.classList.add('face_animation')
    let score = 0;
    placar.innerText = score
    
    hacker()
    
    loop = setInterval(() => {
        
        score = score + 1
        placar.innerText = `: ${Math.floor(score)}`

        let pos_left_player = Number(window.getComputedStyle(player).left.replace('px', ''))
        let pos_right_player = Number(window.getComputedStyle(player).left.replace('px', '')) + 50
        let pos_bottom_player = Number(window.getComputedStyle(player).bottom.replace('px', ''))
        let pos_top_player = Number(window.getComputedStyle(player).bottom.replace('px', '')) + 50
        
        let pos_left_enemy = Number(window.getComputedStyle(enemy).left.replace('px', ''))
        let pos_right_enemy = Number(window.getComputedStyle(enemy).left.replace('px', '')) + 50
        let pos_bottom_enemy = Number(window.getComputedStyle(enemy).bottom.replace('px', ''))
        let pos_top_enemy = Number(window.getComputedStyle(enemy).bottom.replace('px', '')) + 50

        if((pos_bottom_player <= 81) && (pos_left_enemy <= 53) && (pos_left_enemy >= -50)){
            game_over(
                {
                    left: pos_left_player,
                    right: pos_right_player,
                    bottom: pos_bottom_player,
                    top: pos_top_player,
                },
                {
                    left: pos_left_enemy,
                    right: pos_right_enemy,
                    bottom: pos_bottom_enemy,
                    top: pos_top_enemy,
                }
            )}
    },1)
}
