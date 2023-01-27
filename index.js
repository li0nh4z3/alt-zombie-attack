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
        this.width = 50
        this.height = 80
    }

    draw() {
        ctx.fillStyle = 'red'
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

class Zombie {
    constructor() {
        this.position = {
            x: -50,
            y: canvas.height - 250
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
    constructor({ x, y, img }) {
        this.position = {
            x,
            y
        }
        this.img = img
        this.width = 500
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

init = () => {
    platformSrc = 'img/platform.png'
    platformImg = createImage(platformSrc)
    backgroundSrc = 'img/background.png'
    backgroundImg = createImage(backgroundSrc)
    


    platforms = [
        new Platform({x: -50, y: 550, img: platformImg}), 
        new Platform({x: platWidth - 51, y: 550, img: platformImg}),
        new Platform({x: platWidth * 2 + 100, y: 550, img: platformImg}),
        new Platform({x: platWidth * 3 + 290, y: 550, img: platformImg}),
        new Platform({x: platWidth * 4 + 350, y: 550, img: platformImg}),
        new Platform({x: platWidth * 5 + 200, y: 550, img: platformImg})
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
    } else if (keys.left.pressed && player.position.x > 100) {
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
        } else if (keys.left.pressed) {
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
        }, 5000)
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
    }

    //Game Over scenario
    if (player.position.y > canvas.height) {
        init()
    }
}

init()
animate()

addEventListener('keydown', ({keyCode}) => {
    switch (keyCode) {
        case 37:
            keys.left.pressed = true
            break;
        case 39:
            keys.right.pressed = true
            break;
        case 38:
            keys.up.pressed = true
            break;
        case 34:
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
        case 34:
            break;
    }
})