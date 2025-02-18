const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // Ensures pixel-perfect rendering
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const noteDisplay = document.getElementById('note-display');
const noteFullImage = document.getElementById('note-full-image');
const closeNoteBtn = document.getElementById('close-note');

// Load player sprite sheet
const playerWalkImg = new Image();
playerWalkImg.src = 'assets/walking_sheet.png'; // Ensure correct path
playerWalkImg.onload = () => {
    gameLoop(); // Start game only after sprite loads
};

// Load note images
const note1Img = new Image();
note1Img.src = 'assets/note1.png';

const note2Img = new Image();
note2Img.src = 'assets/note2.png';

const note3Img = new Image();
note3Img.src = 'assets/note3.png';

// Array to store notes with positions
let notes = [
    { x: 550, y: 300, image: note1Img },
    { x: 1000, y: 700, image: note2Img },
    { x: 1450, y: 120, image: note3Img }
];

// Player object
let player = {
    x: 100,
    y: 100,
    width: 55, // Width of a single frame
    height: 120, // Height of a single frame
    speed: 5,
    frameX: 0, // Current frame index
    maxFrame: 3, // Total frames (0,1,2,3)
    frameDelay: 4, // Speed of animation (higher = slower)
    frameCounter: 0, // Counter to slow down animation
    moving: false, // Movement state
};

// Store key states
let keys = {};

// Event listeners for movement
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    player.moving = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    player.moving = false;
});

// Update player movement
function update() {
    if (keys['w']) player.y -= player.speed;
    if (keys['s']) player.y += player.speed;
    if (keys['a']) player.x -= player.speed;
    if (keys['d']) player.x += player.speed;

    // Handle animation frames
    if (player.moving) {
        player.frameCounter++;
        if (player.frameCounter >= player.frameDelay) {
            player.frameCounter = 0;
            player.frameX = (player.frameX + 1) % (player.maxFrame + 1); // Loop frames
        }
    } else {
        player.frameX = 0; // Reset to idle frame when not moving
    }
}

// Draw everything
function draw() {
    // Clear the entire canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw background image
    const background = new Image();
    background.src = 'assets/background.png'; // Ensure correct path
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Draw player from sprite sheet
    ctx.drawImage(
        playerWalkImg,
        player.frameX * player.width, 0, // Crop position (x coordinate in sheet)
        player.width, player.height, // Crop size (frame size)
        player.x, player.y, // Player position
        player.width, player.height // Final display size
    );

    // Draw each note
    notes.forEach(note => {
        ctx.drawImage(note.image, note.x, note.y, 40, 40);
    });
}



// Checks if player is close enough to interact with a note
function checkInteraction() {
    notes.forEach(note => {
        let dx = player.x - note.x;
        let dy = player.y - note.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 50) { // If player is close enough
            noteFullImage.src = note.image.src.replace(".png", "_full.jpg"); // Assuming full image follows a naming pattern
            noteDisplay.style.display = 'block'; // Show the new note display
        }
    });
}

closeNoteBtn.addEventListener('click', () => {
    noteDisplay.style.display = 'none';
});

// Click event to check for interactions with notes
canvas.addEventListener('click', () => {
    checkInteraction();
});

// Closes the popup when the button is clicked
document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('note-popup').style.display = 'none';
});

// Main game loop: updates game logic and redraws
function gameLoop() {
    update(); // Update player position
    draw(); // Redraw everything
    requestAnimationFrame(gameLoop); // Calls the loop again
}
