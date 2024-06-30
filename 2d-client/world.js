
class World {
    constructor() {
        this.entities = {};
        this.nextEntityId = 1;
        this.events = [];
        this.generateRocks();
    }

    generateRocks() {
        for (let i = 0; i < 10; i++) {
            this.addEntity({ type: 'rock', x: Math.random() * 800, y: Math.random() * 600 });
        }
    }

    addPlayer() {
        const playerId = this.addEntity({ type: 'player', x: 400, y: 300 });
        return playerId;
    }

    removePlayer(playerId) {
        delete this.entities[playerId];
    }

    addEntity(entity) {
        const id = this.nextEntityId++;
        this.entities[id] = entity;
        return id;
    }

    handleEvent(event, playerId) {
        if (event.type === 'move') {
            this.movePlayer(playerId, event.direction);
        }
        this.events.push(event);
    }

    movePlayer(playerId, direction) {
        const player = this.entities[playerId];
        if (player) {
            switch (direction) {
                case 'up': player.y -= 10; break;
                case 'down': player.y += 10; break;
                case 'left': player.x -= 10; break;
                case 'right': player.x += 10; break;
            }
        }
    }
}

module.exports = World;
