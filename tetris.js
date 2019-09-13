const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
//scale context for bigger elements
context.scale(20, 20);


const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

function draw() {
    // initial board
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(player.matrix, player.pos);
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
    if(dropCounter > dropInterval) {
        player.pos.y++;
        dropCounter = 0;
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

const player = {
    pos: { x: 5, y: 5 },
    matrix: matrix
}

update();


