const inventory = [ { type: 'grass', quantity: 5 }, { type: 'dirt', quantity: 10 }, { type: 'stone', quantity: 5 }, { type: 'cobblestone', quantity: 5 }, { type: 'wood', quantity: 3 }, null, null, null, null ];
const inventoryElement = document.getElementById('inventory');
const inventorySlotsElement = inventoryElement.querySelector('.inventory-slots');

function updateInventoryUI() {
    inventorySlotsElement.innerHTML = '';
    inventory.forEach(item => {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        if (item) {
            slot.textContent = `${item.type} (${item.quantity})`;
            slot.dataset.itemType = item.type;
        }
        inventorySlotsElement.appendChild(slot);
    });
}

function pickupItem(blockType) {
    const existingItem = inventory.find(item => item && item.type === blockType);
    if (existingItem) existingItem.quantity++;
    else {
        const firstEmptySlot = inventory.findIndex(item => item === null);
        if (firstEmptySlot !== -1) inventory[firstEmptySlot] = { type: blockType, quantity: 1 };
    }
    updateInventoryUI();
}

updateInventoryUI();