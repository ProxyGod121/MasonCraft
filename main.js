const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
const world = {};

// --- Sky ---
const skyGeometry = new THREE.SphereGeometry(500, 32, 15);
const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

function addBlockToWorld(x, y, z, type) {
    const key = getKey(x, y, z);
    if (!world[key]) {
        const mesh = createBlockMesh(x, y, z, type);
        world[key] = mesh;
        scene.add(mesh);
    }
}

function removeBlockFromWorld(x, y, z) {
    const key = getKey(x, y, z);
    if (world[key]) {
        scene.remove(world[key]);
        delete world[key];
    }
}

// main.js (continued)

function generateChunk(chunkX, chunkZ, chunkSize = 16) {
    const chunkData = {};
    for (let x = 0; x < chunkSize; x++) {
        for (let z = 0; z < chunkSize; z++) {
            const worldX = chunkX * chunkSize + x;
            const worldZ = chunkZ * chunkSize + z;
            const groundHeight = Math.floor(Math.sin(worldX * 0.1) * Math.cos(worldZ * 0.1) * 5) + 10; // Increased height

            for (let y = 0; y < groundHeight; y++) {
                let blockType = 'dirt';
                if (y < groundHeight - 4) {
                    blockType = Math.random() < 0.8 ? 'stone' : 'cobblestone';
                } else if (y < groundHeight - 1) {
                    blockType = 'dirt';
                } else {
                    blockType = 'grass';
                }
                chunkData[getKey(worldX, y, worldZ)] = blockType;
            }
            if (groundHeight > 0 && Math.random() < 0.05) chunkData[getKey(worldX, groundHeight, worldZ)] = 'sand';
            if (groundHeight > 1 && Math.random() < 0.02) chunkData[getKey(worldX, 1, worldZ)] = 'water';
            if (groundHeight >= 3 && Math.random() < 0.03) for (let i = 0; i < 3; i++) chunkData[getKey(worldX, groundHeight + i, worldZ)] = 'wood';
        }
    }
    return chunkData;
}

const initialChunkX = 0;
const initialChunkZ = 0;
const initialWorldData = generateChunk(initialChunkX, initialChunkZ);
let highestY = -Infinity;
for (const key in initialWorldData) {
    const [x, y, z] = getCoordsFromKey(key);
    addBlockToWorld(x, y, z, initialWorldData[key]);
    if (y > highestY) highestY = y;
}

// Spawn player on top of the map
camera.position.set(0, highestY + 2, 5);
camera.lookAt(0, highestY, 0);

function animate() {
    requestAnimationFrame(animate);

    if (isPointerLocked) {
        camera.translateX(velocity.x);
        camera.translateY(velocity.y);
        camera.translateZ(velocity.z);

        velocity.y += gravity;
        if (camera.position.y < 0.5) {
            camera.position.y = 0.5;
            velocity.y = 0;
            isOnGround = true;
        }
    }

    renderer.render(scene, camera);

    
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});