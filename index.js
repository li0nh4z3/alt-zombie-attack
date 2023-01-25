const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const gravity = 0.5

class Player {
    constructor() {
        this.position = {
            x: canvas.width / 2,
            y: canvas.height / 2
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

const player = new Player()

animate = () => {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
}

animate()

addEventListener('keydown', ({keyCode}) => {
    switch (keyCode) {
        case 37:
            console.log('left')
            break;
        case 39:
            console.log('right')
            break;
        case 38:
            console.log('up')
            break;
        case 34:
            console.log('down')
            break;
    }
})
addEventListener('keyup', ({keyCode}) => {
    switch (keyCode) {
        case 37:
            console.log('left')
            break;
        case 39:
            console.log('right')
            break;
        case 38:
            console.log('up')
            break;
        case 34:
            console.log('down')
            break;
    }
})