// VARIABLES LOGIN
const screen_login = document.querySelector('.entrance')
const login_form = document.querySelector('.login_form')
const login_input = document.querySelector('.login_input')
const login_button = document.querySelector('.login_button')

// VARIABLES GAME CONTROLS
const screen_game = document.querySelector('.game')
const controls = document.querySelector('.controls')
const jump_btn = document.querySelector('.jump')
const fall_btn = document.querySelector('.fall')
const name_player = document.querySelector('.name_player')

// WAITING VARIABLES
const screen_waiting = document.querySelector('.waiting')
const screen_message = document.querySelector('.message')
let num = 5
let reg;
let timeout;

// GAME VARIABLE
const play_again = document.querySelector('.play_again')
const player = document.querySelector('.player') 
const enemy = document.querySelector('.enemy') 
const placar = document.querySelector('.placar')
let winner;

// LOGIN VALIDATION
function check_disabled_input(){
    if(login_input.value.trim().length >= 3){
        login_button.removeAttribute('disabled')
    }else{
        login_button.setAttribute('disabled', 'true')
    }
}

login_input.addEventListener('input', check_disabled_input)

login_form.addEventListener('submit', (e) => {
    e.preventDefault()
    websocket = new WebSocket('ws://localhost:8080')
    
    websocket.addEventListener('open', () => {
        websocket.send(JSON.stringify({ name: login_input.value, loser: '', winner: '' }))
    })

    websocket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data)

        console.log(data)
        console.log(JSON.parse(data.data))

        if(data.peoples == '1' && JSON.parse(data.data) == 1001){
            console.log(JSON.parse(data.data) == 1001 + ', jogo parado')
            num = 5
            timer = 6
            clearInterval(reg)
            clearTimeout(timeout)
            screen_waiting.style.display = 'flex'
            screen_message.innerText = `${data.peoples == '1' ? `Só há você online` : `tem ${data.peoples} pessoas online`}`
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            return
        }

        if(data.peoples == '2' && JSON.parse(data.data) != 1001 && JSON.parse(data.data).loser == '' && JSON.parse(data.data).winner == ''){
            console.log(JSON.parse(data.data) !== 1001)
            screen_waiting.style.display = 'flex'
                reg = setInterval(() => {
                    num--
                    screen_message.innerText = `O jogo começa em ${num}`
                }, 1000);
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            timeout = setTimeout(() => {
                screen_waiting.style.display = 'none'
                screen_login.style.display = 'none'
                name_player.innerText = login_input.value
                //LEVAR O PLAYER A TELA DO JOGO
                screen_game.style.display = 'block'
                play_game()
            }, 6000);
        }
        
        if(JSON.parse(data.data).loser == '' && JSON.parse(data.data).winner == ''){
            screen_waiting.style.display = 'flex'
            screen_message.innerText = `${data.peoples == '1' ? `Só há você online` : `tem ${data.peoples} pessoas online`}`
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            return
        }else if(JSON.parse(data.data).loser != name_player.innerText){
            console.log(JSON.parse(data.data).loser)
            console.log(data.names)
            console.log(name_player.innerText)
            websocket.send(JSON.stringify({ loser: JSON.parse(data.data).loser, winner: name_player.innerText }))
            console.log(JSON.parse(data.data).loser)
            console.log(JSON.parse(data.data).winner)
            websocket.close()
            name_player.innerText = ''
            screen_waiting.style.display = 'flex'
            play_again.style.display = 'block'
            play_again.style.backgroundColor = 'var(--color5)'
            screen_message.innerHTML = `Vc Ganhou <br> ${JSON.parse(data.data).loser} Perdeu`
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            return
        }else if(JSON.parse(data.data).loser == name_player.innerText){
            websocket.send(JSON.stringify({ loser: name_player.innerText, winner: JSON.parse(data.data).winner }))
            console.log('1: ' + data.names.split(':')[2].replace(',2',''))
            if(data.names.split(':')[1].replace(',2','') == name_player.innerText){
                winner = data.names.split(':')[1].replace(',2','')
            }
            else{
                winner = data.names.split(':')[2].replace(',2','')
            }
            console.log(JSON.parse(data.data).loser)
            websocket.close()
            name_player.innerText = ''
            screen_waiting.style.display = 'flex'
            play_again.style.display = 'block'
            play_again.style.backgroundColor = 'var(--color2)'
            screen_message.innerHTML = `Vc Perdeu <br>${winner} Ganhou`
            screen_login.style.display = 'none'
            screen_game.style.display = 'none'
            return
        }
    })
})

// FUNCTION INTERATIONS
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