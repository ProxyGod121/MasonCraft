let isPointerLocked = false;
let yaw = 0;
let pitch = 0;
const sensitivity = 0.002;
const moveSpeed = 0.1;
const velocity = new THREE.Vector3();
const gravity = -0.02;
let isOnGround = false;
let currentBlockType = 'dirt';

function onPointerlockChange() {
    isPointerLocked = document.pointerLockElement === document.getElementById('gameCanvas');
    document.body.classList.toggle('locked', isPointerLocked);
}

function onPointerlockError() {
    console.error('Pointer lock error');
}

document.addEventListener('pointerlockchange', onPointerlockChange);
document.addEventListener('pointerlockerror', onPointerlockError);

document.getElementById('gameCanvas').addEventListener('click', () => {
    document.getElementById('gameCanvas').requestPointerLock();
});

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW': velocity.z = -moveSpeed; break;
        case 'KeyS': velocity.z = moveSpeed; break;
        case 'KeyA': velocity.x = -moveSpeed; break;
        case 'KeyD': velocity.x = moveSpeed; break;
        case 'Space': if (isOnGround) velocity.y = 0.2; isOnGround = false; break;
        case 'Digit1': currentBlockType = 'dirt'; break;
        case 'Digit2': currentBlockType = 'grass'; break;
        case 'Digit3': currentBlockType = 'stone'; break;
        case 'Digit4': currentBlockType = 'cobblestone'; break;
        case 'Digit5': currentBlockType = 'sand'; break;
        case 'Digit6': currentBlockType = 'water'; break;
        case 'Digit7': currentBlockType = 'wood'; break;
        case 'Digit8': currentBlockType = 'planks'; break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW': if (velocity.z < 0) velocity.z = 0; break;
        case 'KeyS': if (velocity.z > 0) velocity.z = 0; break;
        case 'KeyA': if (velocity.x < 0) velocity.x = 0; break;
        case 'KeyD': if (velocity.x > 0) velocity.x = 0; break;
    }
});

document.addEventListener('mousemove', (event) => {
    if (isPointerLocked) {
        const deltaX = event.movementX || event.mozMovementX || 0;
        const deltaY = event.movementY || event.mozMovementY || 0;

        yaw -= deltaX * sensitivity;
        pitch -= deltaY * sensitivity;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

        camera.rotation.order = 'YXZ';
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;
    }
});

document.addEventListener('mousedown', (event) => {
    if (!isPointerLocked) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = 0;
    mouse.y = 0;
    raycaster.setFromCamera(camera, mouse);
    const intersects = raycaster.intersectObjects(Object.values(world));

    if (intersects.length > 0) {
        const clickedBlock = intersects[0].object;
        const blockPosition = clickedBlock.position.clone();
        const blockKey = getKey(Math.round(blockPosition.x), Math.round(blockPosition.y), Math.round(blockPosition.z));

        if (event.button === 0) { // Left click for mining
            const minedBlockType = world[blockKey]?.material?.color ? getBlockTypeFromColor(world[blockKey].material.color) : 'stone';
            removeBlockFromWorld(Math.round(blockPosition.x), Math.round(blockPosition.y), Math.round(blockPosition.z));
            pickupItem(minedBlockType);
        } else if (event.button === 2) { // Right click for placing
            const normalMatrix = new THREE.Matrix3().normalFromMatrix4(clickedBlock.matrixWorld);
            const faceNormal = intersects[0].face.normal.clone().applyMatrix3(normalMatrix).round();
            const placePosition = clickedBlock.position.clone().add(faceNormal);
            const snappedX = Math.round(placePosition.x);
            const snappedY = Math.round(placePosition.y);
            const snappedZ = Math.round(placePosition.z);
            const selectedItemSlot = inventory.find(item => item && item.quantity > 0 && item.type === currentBlockType);
            if (selectedItemSlot) {
                addBlockToWorld(snappedX, snappedY, snappedZ, currentBlockType);
                selectedItemSlot.quantity--;
                if (selectedItemSlot.quantity === 0) {
                    const index = inventory.indexOf(selectedItemSlot);
                    inventory[index] = null;
                }
                updateInventoryUI();
            }
        }
    }
});