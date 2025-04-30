function createBlockMesh(x, y, z, type) {
    const blockInfo = blockTypes[type] || blockTypes.stone;
    const material = new THREE.MeshBasicMaterial({ color: blockInfo.color });
    const cube = new THREE.Mesh(blockGeometry, material);
    cube.position.set(x, y, z);
    return cube;
}

function getKey(x, y, z) {
    return `${x},${y},${z}`;
}

function getCoordsFromKey(key) {
    return key.split(',').map(Number);
}

function getBlockTypeFromColor(color) {
    const hexColor = color.getHex();
    for (const type in blockTypes) {
        if (blockTypes[type].color === hexColor) {
            return type;
        }
    }
    return 'stone';
}