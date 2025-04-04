let lastRenderTime = 0;

const snakeSpeed = 15;

const board = document.getElementById('board')

const snakeBody = [
    {x: 11, y: 11}
]

let inputDirection = { x:0, y:0 }
let lastInputDirection = { x:0, y:0 }

let newSegments = 0;

let gameOver = false;

requestAnimationFrame(main)

function main(currentTime) {
    if (gameOver) {
        if (confirm('Você Morreu!')) {
            alert('Restart?')
        }
        return
    }

    requestAnimationFrame(main)

    const secoundsSinceLastRender = (currentTime - lastRenderTime) / 1000

    if (secoundsSinceLastRender < 1 / snakeSpeed) return

    lastRenderTime = currentTime

    update()
    draw()
}

let food = {
    x: 2,
    y: 8,
}

const expansionRate = 1;

const gridSize = 21;

function outsiderGrid(position) {
    return position.x < 1 || position.x > gridSize || position.y < 1 || position.y > gridSize 
}

function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * gridSize) + 1,
        y: Math.floor(Math.random() * gridSize) + 1, 
    }
}

function getRandomFoodPosition() {
    let newFoodPosition;

    while (newFoodPosition == null || onSnake(newFoodPosition)){
        newFoodPosition = randomGridPosition();
    }

    return newFoodPosition
}

function updateFood() {
    if (onSnake(food)) {
        expandSnake(expansionRate)
        food = getRandomFoodPosition()
    }
}

function drawFood() {
    const foodElement = document.createElement('div')
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;
    foodElement.classList.add('food');
    board.appendChild(foodElement)
}

function expandSnake(amount) {
    newSegments += amount
}

function addSegment() {
    for(let i = 0; i < newSegments; i ++) {
        snakeBody.push({...snakeBody[snakeBody.length - 1]})
    }

    newSegments = 0
}

function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((segment, index) => {
        if( ignoreHead && index === 0)
        return

        return position.x === segment.x && position.y === segment.y
    })
}

function getSnakeHead() {
    return snakeBody[0];
}

function getInputDirection() {
    lastInputDirection = inputDirection
    return inputDirection
}

addEventListener('keydown', e => {
    switch(e.key){
        case "ArrowUp": 
            if (lastInputDirection.y !== 0) break;
            inputDirection = { x: 0, y: -1 };
            break;

        case "ArrowDown": 
            if (lastInputDirection.y !== 0) break;
            inputDirection = { x: 0, y: 1 };
            break;

        case "ArrowLeft": 
            if (lastInputDirection.x !== 0) break;
            inputDirection = { x: -1, y: 0 };
            break;
        
        case "ArrowRight":
            if (lastInputDirection.x !== 0) break; 
            inputDirection = { x: 1, y: 0 }
            break;
    }
})

function updateSnake() {
    addSegment();

    const inputDirection = getInputDirection()

    for (let i = snakeBody.length - 2; i >= 0; i--){
        snakeBody[i+1] = {...snakeBody[i]}
    }

    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}

function drawSnake(board) {
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.classList.add('snake');
        board.appendChild(snakeElement)
    })
}

function update() {
    updateSnake();
    updateFood();
    checkDeath();
}

function draw() {
    board.innerHTML = ""
    drawFood(board);
    drawSnake(board);
}

function checkDeath() {
    gameOver = outsiderGrid(getSnakeHead()) || snakeIntersection()
}

function snakeIntersection() {
    return onSnake(getSnakeHead(), {
        ignoreHead: true
    })
}