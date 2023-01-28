const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
if (innerWidth > 900) {
    canvas.width = 900
}
canvas.height = innerHeight
if (innerHeight > 650) {
    canvas.height = 650
}

const gravity = 0.9

class Player {
    constructor() {
        this.position = {
            x: canvas.width / 5,
            y: canvas.height / 5
        }
        this.speed = {
            x: 0,
            y: 1
        }
        this.rush = 5
        this.width = 190 / 2.5
        this.height = 270 / 2.5

        this.img = createImage('img/sprite_player_right.png')
        this.frames = 0
        this.sprites = {
            run : {
                right: createImage('img/sprite_player_right.png'),
                cropWidth: 190
            }
        }
        this.currentSprite = this.sprites.run.right
        this.currCropWidth = 190
    }

    draw() {
        ctx.drawImage(
            this.currentSprite, 
            this.currCropWidth * this.frames,
            0,
            this.currCropWidth,
            270,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            )
    }

    update() {
        this.frames++
        if (this.frames > 8) this.frames = 0
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y

        if (this.position.y + this.height + this.speed.y <= canvas.height) {
            this.speed.y += gravity
        }
    }
}

class Zombie {
    constructor() {
        this.position = {
            x: -50,
            y: 0
        }
        this.speed = {
            x: 0.5,
            y: 0
        }
        this.width = 40
        this.height = 70
    }

    draw() {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
        
        if (this.position.y + this.height + this.speed.y <= canvas.height) {
            this.speed.y += gravity
        }
    }
}

class Platform {
    constructor({ x, y, img, w}) {
        this.position = {
            x,
            y
        }
        this.img = img
        this.width = w
        this.height = 200
        
    }

    draw() {
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height)
    }
}

class Element {
    constructor({ x, y, img, w }) {
        this.position = {
            x,
            y
        }
        this.img = img
        this.width = w
        this.height = 650
        
    }

    draw() {
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height)
    }
}

createImage = (imgSrc) => {
    const img = new Image()
    img.src = imgSrc
    return img
}

let platformSrc = 'img/platform.png'
let platformImg = createImage(platformSrc)

let backgroundSrc = 'img/background.png'
let backgroundImg = createImage(backgroundSrc)

let elementsSrc = 'img/sprite_elements.png'
let elementImg = createImage(elementsSrc)

let platSmallSrc = 'img/platform_s.png'
let platSmallImg = createImage(platSmallSrc)


let platforms = []
let platWidth = 500;

let background;
let player = new Player()

let zombies = []

let elements = []

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up : {
        pressed: false
    }
}
let scrollOffset = 0

let intervalZ;
let restart = document.getElementById("game-over")

//Game Over function
gameOver = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    zombies = []
    elements = []
    player.rush = 0
    player.speed.y = -10
    clearInterval(intervalZ)
    restart.style.display = 'block'
}

init = () => {
    platformSrc = 'img/platform.png'
    platformImg = createImage(platformSrc)
    backgroundSrc = 'img/background.png'
    backgroundImg = createImage(backgroundSrc)  

    platforms = [
        new Platform({x: platWidth * 3 - 24, y: 350, img: platSmallImg, w: 250}),
        new Platform({x: platWidth * 3 + 550, y: 450, img: platSmallImg, w: 250}),
        new Platform({x: platWidth * 3 + 950, y: 350, img: platSmallImg, w: 250}),
        new Platform({x: platWidth * 5 + 650, y: 100, img: platSmallImg, w: 250}),
        new Platform({x: platWidth * 5 + 1150, y: 100, img: platSmallImg, w: 250}),
        new Platform({x: -50, y: 550, img: platformImg, w: platWidth}), 
        new Platform({x: platWidth - 51, y: 550, img: platSmallImg, w: 250}),
        new Platform({x: platWidth * 2 - 100, y: 550, img: platformImg, w: platWidth}),
        new Platform({x: platWidth * 3 + 300, y: 550, img: platformImg, w: platWidth}),
        new Platform({x: platWidth * 4 + 850, y: 550, img: platformImg, w: platWidth}),
        new Platform({x: platWidth * 5 + 950, y: 450, img: platformImg, w: platWidth}),
        new Platform({x: platWidth * 5 + 1600, y: 250, img: platSmallImg, w: 250}),
        new Platform({x: platWidth * 6 + 1600, y: 250, img: platSmallImg, w: 250}),
        new Platform({x: platWidth * 8 + 1502, y: 550, img: platSmallImg, w: 250}),
        new Platform({x: platWidth * 7 + 1650, y: 550, img: platformImg, w: platWidth})
    ]

    player = new Player()

    zombies = [new Zombie()]

    background = new Element({x: 0, y: 0, img: backgroundImg, w: 900})
    
    elements = [
        new Element({x: 0, y: 0, img: elementImg, w: 5400})
    ]

    scrollOffset = 0
    clearInterval(intervalZ)
}



animate = () => {
    requestAnimationFrame(animate)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    background.draw()

    elements.forEach(element => {
        element.draw()
    })
    
    platforms.forEach(platform => {    
        platform.draw()
    })
    
    player.update()
    
    zombies.forEach(zombie => {
        zombie.update()
    })
    
    //Movement
    if (keys.right.pressed && player.position.x < 400) {
        player.speed.x = player.rush * 1.5
    } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
        player.speed.x = -player.rush
    } else if (keys.up.pressed) {
        player.speed.y = -10
    } else {
        player.speed.x = 0
        if (keys.right.pressed) {
            scrollOffset += player.rush
            platforms.forEach(platform => {    
                platform.position.x -= player.rush
            })
            elements.forEach(element => {    
                element.position.x -= player.rush*.88
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= 5
            platforms.forEach(platform => {    
                platform.position.x += player.rush
            })
            elements.forEach(element => {    
                element.position.x += player.rush*.88
            })
        }
    }
    
    //Zombies, collision & direction
    if (scrollOffset === 50) {
        intervalZ = setInterval(() => {
            zombies.push(new Zombie())
        }, 3000)
    }
    zombies.forEach(zombie => {
        if (keys.left.pressed && player.position.x + player.width < zombie.position.x) {
            zombie.speed.x *= -1
        } else if (player.position.x + player.width < zombie.position.x) {
            zombie.speed.x = -0.5
        } else if (zombie + 1) {
            zombie.speed.x += 0.005
        }

        if (player.position.x < zombie.position.x + zombie.width + zombie.speed.x &&
            player.position.x + player.width + player.speed.x > zombie.position.x &&
            player.position.y < zombie.position.y + zombie.height &&
            player.height + player.position.y > zombie.position.y) {
                console.log('hit')
                zombie.speed.x = 0
                gameOver()
        }

        for( let i = 0; i < platforms.length; i++) {
            if (zombie.position.y + zombie.height <= platforms[i].position.y 
                && zombie.position.y + zombie.height + zombie.speed.y >= platforms[i].position.y
                && zombie.position.x + zombie.width >= platforms[i].position.x
                && zombie.position.x <= platforms[i].position.x + platforms[i].width) {
                zombie.speed.y = 0
            }
        }
    })

    //Platform collision detected
    platforms.forEach(platform => {    
        if (player.position.y + player.height <= platform.position.y 
            && player.position.y + player.height + player.speed.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width) {
                player.speed.y = 0
            }
    })

    //Win scenario
    if (scrollOffset > 5000) {
        console.log('you win')
        clearInterval(intervalZ)
    }

    //Falling scenario
    if (player.position.y > canvas.height) {
        init()
    }
}

let title = document.querySelector('h1')
let playButton = document.getElementById('play')
playButton.onclick = () => {
    playButton.style.display = 'none'
    title.style.display = 'none'
    init()
    animate()
}
let restartButton = document.getElementById('restart-game-over')
restartButton.onclick = () => {
    restart.style.display = 'none'
    init()
}


addEventListener('keydown', ({keyCode}) => {
    switch (keyCode) {
        case 37:
            keys.left.pressed = true
            break;
        case 39:
            keys.right.pressed = true
            player.currentSprite = player.sprites.run.right
            player.currCropWidth = player.sprites.run.cropWidth
            break;
        case 38:
            keys.up.pressed = true
            break;
    }
})

addEventListener('keyup', ({keyCode}) => {
    switch (keyCode) {
        case 37:
            keys.left.pressed = false
            break;
        case 39:
            keys.right.pressed = false
            break;
        case 38:
            keys.up.pressed = false
            break;
    }
})