const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Define a fixed base resolution
const baseWidth = 1920;
const baseHeight = 1080;
canvas.width = baseWidth;
canvas.height = baseHeight;

// Scaling factor to adapt to different screen sizes
let scaleX, scaleY, scale;

function resizeCanvas() {
    scaleX = window.innerWidth / baseWidth;
    scaleY = window.innerHeight / baseHeight;
    scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.setTransform(scale, 0, 0, scale, 0, 0); // Apply scaling transformation
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const noteDisplay = document.getElementById('note-display');
const noteFullImage = document.getElementById('note-full-image');
const closeNoteBtn = document.getElementById('close-note');

// Load player sprite sheet
const playerWalkImg = new Image();
playerWalkImg.src = 'assets/walking_sheet.png';
playerWalkImg.onload = () => {
    gameLoop();
};

// Load note images
const note1Img = new Image();
note1Img.src = 'assets/note1.png';
const note2Img = new Image();
note2Img.src = 'assets/note2.png';
const note3Img = new Image();
note3Img.src = 'assets/note3.png';

let notes = [
    { x: 650 / baseWidth, y: 300 / baseHeight, image: note1Img },
    { x: 1100 / baseWidth, y: 530 / baseHeight, image: note2Img },
    { x: 1700 / baseWidth, y: 120 / baseHeight, image: note3Img }
];

let player = {
    x: 100,
    y: 300,
    width: 55,
    height: 120,
    speed: 2,
    frameX: 0,
    maxFrame: 3,
    frameDelay: 4,
    frameCounter: 0,
    moving: false,
    targetX: 100,
    targetY: 300
};

canvas.addEventListener('click', (event) => {
    let rect = canvas.getBoundingClientRect();
    let clickX = (event.clientX - rect.left) / scale;
    let clickY = (event.clientY - rect.top) / scale;

    player.targetX = clickX;
    player.targetY = clickY;
    player.moving = true;
});

function update() {
    let dx = player.targetX - player.x;
    let dy = player.targetY - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 2) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    } else {
        player.moving = false;
    }

    if (player.moving) {
        player.frameCounter++;
        if (player.frameCounter >= player.frameDelay) {
            player.frameCounter = 0;
            player.frameX = (player.frameX + 1) % (player.maxFrame + 1);
        }
    } else {
        player.frameX = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const background = new Image();
    background.src = 'assets/background.png';
    ctx.drawImage(background, 0, 0, baseWidth, baseHeight);

    ctx.drawImage(
        playerWalkImg,
        player.frameX * player.width, 0,
        player.width, player.height,
        player.x, player.y,
        player.width, player.height
    );

    notes.forEach(note => {
        ctx.drawImage(note.image, note.x * baseWidth, note.y * baseHeight, 40, 40);
    });
}

function checkInteraction() {
    notes.forEach(note => {
        let dx = player.x - (note.x * baseWidth);
        let dy = player.y - (note.y * baseHeight);
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50) {
            noteFullImage.src = note.image.src.replace(".png", "_full.jpg");
            noteDisplay.style.display = 'block';
        }
    });
}

closeNoteBtn.addEventListener('click', () => {
    noteDisplay.style.display = 'none';
});

gameCanvas.addEventListener('click', () => {
    checkInteraction();
});

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('note-popup').style.display = 'none';
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.body.style.opacity = 0;
window.onload = function () {
    document.body.style.transition = "opacity 1s";
    document.body.style.opacity = 1;
};
