
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:8080');

let playerId = null;
let world = {};

ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'connected') {
        playerId = data.playerId;
    } else if (data.type === 'update') {
        world = data.world;
        drawWorld();
    }
};

document.addEventListener('keydown', (event) => {
    if (playerId) {
        ws.send(JSON.stringify({ type: 'move', direction: event.key }));
    }
});

function drawWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const entityId in world.entities) {
        const entity = world.entities[entityId];
        ctx.fillStyle = entity.type === 'player' ? 'blue' : 'gray';
        ctx.fillRect(entity.x, entity.y, 10, 10);
    }
}
