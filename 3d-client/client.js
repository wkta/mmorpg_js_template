let ws = null;
let scene, camera, renderer;
let playerId = null;
let world = {};
let cubes = {};
const d = 628;  // Dimension parameter to control the view size

function initGame() {
    // Set up the scene
    scene = new THREE.Scene();

    // Set up the camera with an orthographic projection
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -350, 800);

    // Position the camera to give an isometric view, centered at (0,0)
    camera.position.set(300, 300, 300);
    camera.lookAt(0, 0, 0); // Centering the camera at the world position (0, 0)

    // Set up the renderer
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
		renderer.domElement.style.top = 0;
		renderer.domElement.style.left = 0;
		//renderer.domElement.style.width = '100%';
		//renderer.domElement.style.height = '100%';
		document.body.appendChild(renderer.domElement);

    // Create a green plane for the ground, centered at (0,0)
    const planeGeometry = new THREE.PlaneGeometry(800, 800);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 'green' });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		//plane.position.x = -500;
		//plane.position.y = 0;
    
		plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
		plane.translateY(-300);
		plane.translateX(400);
		
    scene.add(plane);

    // Set up the WebSocket connection
    ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === 'connected') {
            playerId = data.playerId;
        } else if (data.type === 'update') {
            world = data.world;
            updateWorld();
        }
    };

    // Start the animation loop
    animate();
}

// Send player movement to the server and prevent default arrow key behavior
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
            event.preventDefault(); // Prevent arrow keys from scrolling the window
        }
    }
});

// Update the world and render the scene
function updateWorld() {
    for (const entityId in world.entities) {
        const entity = world.entities[entityId];
        if (!cubes[entityId]) {
            const geometry = new THREE.BoxGeometry(20, 20, 20);
            const material = new THREE.MeshBasicMaterial({ color: entity.type === 'player' ? 'blue' : 'gray' });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            cubes[entityId] = cube;
        }
        cubes[entityId].position.set(entity.x, 10, entity.y); // Adjusting the y-coordinate for height
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});