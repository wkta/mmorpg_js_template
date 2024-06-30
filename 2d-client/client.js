

let ws = null;
let canvas = null;
let playerId = null;
let world = {};


function initGame(){
	canvas = document.getElementById('gameCanvas');
	window.ctx = canvas.getContext('2d');
	console.log('canvas rdy');
	
	ws = new WebSocket('ws://localhost:8080');
	// From now on, receive messages from the server
	ws.onmessage = (message) => {
		
			const data = JSON.parse(message.data);
			if (data.type === 'connected') {
					playerId = data.playerId;
					console.log('connected to the server, playerid->',playerId);
			} else if (data.type === 'update') {
					world = data.world;
					drawWorld();
			}
	};
}


// Send player movement to the server
document.addEventListener('keydown', (event) => {
    if (playerId) {
        let direction = null;
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
        if (direction) {
            ws.send(JSON.stringify({ type: 'move', direction: direction }));
        }
    }
});

// Draw the world and entities on the canvas
function drawWorld() {
    window.ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.ctx.fillStyle = 'green';
    window.ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const entityId in world.entities) {
        const entity = world.entities[entityId];
        window.ctx.fillStyle = entity.type === 'player' ? 'blue' : 'gray';
        window.ctx.fillRect(entity.x, entity.y, 20, 20); // Adjusted size for better visibility
    }
}
