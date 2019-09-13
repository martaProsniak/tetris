const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
//scale context for bigger elements
context.scale(20, 20);


const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            let isCollision =
                // check if the place in area is free
                (arena[y + o.y] &&
                    arena[y + o.y][x + o.x]) !== 0
            if (m[y][x] !== 0 && isCollision) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function draw() {
    // initial board
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x : 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

//copy player's end position and save it in the arena
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        player.pos.y = 0;
    }
    dropCounter = 0;
}

function playerMove(dir){
    player.pos.x += dir;
    if (collide(arena, player)){
        player.pos.x -= dir;
    }
}

function playerRotate(dir){
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    // check if rotation is possible (element won't collide with arena)
    while (collide(arena, player)){
        player.pos.x += offset;
        offset = -((offset) + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length){
            rotate(player.matrix, -dir)
            player.pos.x = pos;
            return;
        }
    }
}


function rotate(matrix, dir){
    for (let y = 0; y < matrix.length; ++y){
        for (let x = 0; x < y; ++x){
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0){
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

// initial drop counter 
let dropCounter = 0;
// screen will be updated every second
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    // if drop counter is more than 1s, update the screen
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x,
                    y + offset.y,
                    1, 1);
            }
        })
    });
};

// arena to display game progress
const arena = createMatrix(12, 20);

const player = {
    pos: { x: 5, y: 5 },
    matrix: matrix
}

document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 37: {
            playerMove(-1);
            break;
        }
        case 39: {
            playerMove(1);
            break;
        }
        case 40: {
            playerDrop();
            break;
        }
        case 87: {
            playerRotate(-1);
            break;
        }
        case 81: {
            playerRotate(1);
            break;
        }
    }
})

update();


