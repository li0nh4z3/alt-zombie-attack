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
        } else this.speed.y = 0
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
        } else this.speed.y = 0
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
        this.height = 100
        
    }

    draw() {
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height)
    }
}

class Element {
    constructor({ x, y, img }) {
        this.position = {
            x,
            y
        }
        this.img = img
        this.width = 500
        this.height = 100
        
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
const platformSrc = 'img/platform.png'
let platformImg = createImage(platformSrc)
const firstBackgroundSrc = 'img/background1.png'
let firstBackgroundImg = createImage(firstBackgroundSrc)
const mainBackgroundSrc = 'img/background2.png'
let mainBackgroundImg = createImage(mainBackgroundSrc)


const platforms = [new Platform({x: -50, y: 550, img: platformImg}), new Platform({x: 450 - 3, y: 550, img: platformImg})]
const player = new Player()
const zombies = [new Zombie()]
const elements = [new Element({x: 0, y: 0, img: firstBackgroundImg})]
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

animate = () => {
    requestAnimationFrame(animate)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    platforms.forEach(platform => {    
        platform.draw()
    })
    player.update()
    zombies.forEach(zombie => {
        zombie.update()
    })
    
    //Movement
    if (keys.right.pressed && player.position.x < 400) {
        player.speed.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.speed.x = -5
    } else if (keys.up.pressed) {
        player.speed.y = -10
    } else {
        player.speed.x = 0
        if (keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach(platform => {    
                platform.position.x -= 5
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(platform => {    
                platform.position.x += 5
            })
        }
    }
    
    let interval;
    if (scrollOffset === 50) {
        interval = setInterval(() => {
            zombies.push(new Zombie())
        }, 5000)
    } else clearInterval(interval)
    
    
    
    //Zombies collision & direction
    zombies.forEach(zombie => {
        //zombie.speed.x *= -1
        if (keys.left.pressed && player.position.x + player.width < zombie.position.x) {
            zombie.speed.x *= -1
        } else if (player.position.x + player.width < zombie.position.x) {
            zombie.speed.x = -0.5
        } else zombie.speed.x = 0.5
        if (player.position.x < zombie.position.x + zombie.width + zombie.speed.x &&
            player.position.x + player.width + player.speed.x > zombie.position.x &&
            player.position.y < zombie.position.y + zombie.height &&
            player.height + player.position.y > zombie.position.y) {
                console.log('hit')
        }
        if (zombie.position.y + zombie.height <= platforms[0].position.y 
            && zombie.position.y + zombie.height + zombie.speed.y >= platforms[0].position.y
            && zombie.position.x + zombie.width >= platforms[0].position.x) {
            zombie.speed.y = 0
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

    if (scrollOffset > 2000) {
        console.log('you win')
    }
}

animate()

addEventListener('keydown', ({keyCode}) => {
    switch (keyCode) {
        case 37:
            //console.log('left')
            keys.left.pressed = true
            break;
        case 39:
            //console.log('right')
            keys.right.pressed = true
            break;
        case 38:
            //console.log('up')
            keys.up.pressed = true
            break;
        case 34:
            //console.log('down')
            break;
    }
    console.log(keys.right.pressed)
})

addEventListener('keyup', ({keyCode}) => {
    switch (keyCode) {
        case 37:
            console.log('left')
            keys.left.pressed = false
            break;
        case 39:
            console.log('right')
            keys.right.pressed = false
            break;
        case 38:
            console.log('up')
            keys.up.pressed = false
            break;
        case 34:
            console.log('down')
            break;
    }
    console.log(keys.right.pressed)
})