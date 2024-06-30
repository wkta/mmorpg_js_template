const http = require('http');
const WebSocketServer = require('websocket').server;
const World = require('./world');

// Create HTTP server
const server = http.createServer((request, response) => {
    response.writeHead(404);
    response.end();
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});

// Create WebSocket server
const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

let world = new World();

wsServer.on('request', (request) => {
    const connection = request.accept(null, request.origin);
	
    const playerId = world.addPlayer();

    connection.sendUTF(JSON.stringify({ type: 'connected', playerId }));
		
		// broadcast an update
		wsServer.connections.forEach(
			conn => conn.sendUTF(JSON.stringify({ type: 'update', world }))
		);  // when a player spawns

    connection.on('message', (message) => {
				console.log(message);
        if (message.type === 'utf8') {
            const event = JSON.parse(message.utf8Data);
						console.log('pass event to world');
            world.handleEvent(event, playerId);
						
						// broadcast an update
						wsServer.connections.forEach(
							conn => conn.sendUTF(JSON.stringify({ type: 'update', world }))
						);  // when a player moved

        }
    });

    connection.on('close', () => {
        world.removePlayer(playerId);
    });

});

