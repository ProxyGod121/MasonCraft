// collision.js

import * as THREE from 'three';
import { world, getKey } from './main.js'; // Assuming 'world' and 'getKey' are exported from main.js
import { camera, velocity, isOnGround } from './player.js'; // Assuming these are exported from player.js

const playerRadius = 0.5; // Approximate player radius

function getNearbyBlockCoords(position) {
    const x = Math.round(position.x);
    const y = Math.round(position.y);
    const z = Math.round(position.z);
    const nearbyCoords = [];

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                nearbyCoords.push([x + dx, y + dy, z + dz]);
            }
        }
    }
    return nearbyCoords;
}

export function checkCollision() {
    const nearbyBlocks = getNearbyBlockCoords(camera.position);

    for (const [bx, by, bz] of nearbyBlocks) {
        const blockKey = getKey(bx, by, bz);
        if (world[blockKey]) {
            const block = world[blockKey];
            const blockCenter = new THREE.Vector3(bx + 0.5, by + 0.5, bz + 0.5);

            // Check for overlap in each dimension
            const deltaX = camera.position.x - blockCenter.x;
            const deltaY = camera.position.y - blockCenter.y;
            const deltaZ = camera.position.z - blockCenter.z;

            const absoluteDeltaX = Math.abs(deltaX);
            const absoluteDeltaY = Math.abs(deltaY);
            const absoluteDeltaZ = Math.abs(deltaZ);

            const extentX = 0.5 + playerRadius;
            const extentY = 0.5 + playerRadius;
            const extentZ = 0.5 + playerRadius;

            if (absoluteDeltaX < extentX && absoluteDeltaY < extentY && absoluteDeltaZ < extentZ) {
                // Collision detected! Resolve it by pushing the camera out of the block

                // Resolve X-axis collision
                if (absoluteDeltaX > absoluteDeltaY && absoluteDeltaX > absoluteDeltaZ) {
                    camera.position.x += (deltaX > 0) ? extentX - absoluteDeltaX : -(extentX - absoluteDeltaX);
                    velocity.x = 0; // Stop movement in this direction
                }
                // Resolve Y-axis collision
                else if (absoluteDeltaY > absoluteDeltaX && absoluteDeltaY > absoluteDeltaZ) {
                    camera.position.y += (deltaY > 0) ? extentY - absoluteDeltaY : -(extentY - absoluteDeltaY);
                    velocity.y = 0; // Stop vertical movement
                    isOnGround.value = true; // Assuming isOnGround is a mutable value (e.g., an object property)
                }
                // Resolve Z-axis collision
                else if (absoluteDeltaZ > absoluteDeltaX && absoluteDeltaZ > absoluteDeltaY) {
                    camera.position.z += (deltaZ > 0) ? extentZ - absoluteDeltaZ : -(extentZ - absoluteDeltaZ);
                    velocity.z = 0; // Stop movement in this direction
                }
            }
        }
    }
}