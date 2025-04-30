const craftingGridSlots = document.querySelectorAll('.crafting-slot');
const craftButton = document.getElementById('craft-button');
const craftingResult = document.getElementById('crafting-result');
const craftingGrid = [null, null, null, null, null, null, null, null, null];
const recipes = [
    { pattern: ['wood', null, null, null, null, null, null, null, null], result: { type: 'planks', quantity: 4 } },
    { pattern: [null, 'wood', null, null, null, null, null, null, null], result: { type: 'planks', quantity: 4 } },
    { pattern: [null, null, 'wood', null, null, null, null, null, null], result: { type: 'planks', quantity: 4 } },
    { pattern: [null, null, null, 'wood', null, null, null, null, null], result: { type: 'planks', quantity: 4 } },
    { pattern: [null, null, null, null, 'wood', null, null, null, null], result: { type: 'planks', quantity: 4 } },
    { pattern: [null, null, null, null, null, null, 'wood', null, null], result: { type: 'planks', quantity: 4 } },
    { pattern: [null, null, null, null, null, null, null, 'wood', null], result: { type: 'planks', quantity: 4 } },
    { pattern: [null, null, null, null, null, null, null, null, 'wood'], result: { type: 'planks', quantity: 4 } },
];

craftingGridSlots.forEach((slot, index) => {
    slot.addEventListener('click', () => {
        const firstInventoryItemIndex = inventory.findIndex(item => item && item.quantity > 0);
        if (firstInventoryItemIndex !== -1) {
            const itemToMove = inventory[firstInventoryItemIndex];
            craftingGrid[index] = itemToMove.type;
            itemToMove.quantity--;
            if (itemToMove.quantity === 0) inventory[firstInventoryItemIndex] = null;
            updateCraftingUI();
            updateInventoryUI();
        }
    });
});

craftButton.addEventListener('click', () => {
    const result = checkCraftingRecipes();
    if (result) {
        craftingResult.textContent = `Crafted: ${result.type} x ${result.quantity}`;
        pickupItem(result.type);
        craftingGrid.fill(null);
        updateCraftingUI();
    } else craftingResult.textContent = 'No recipe found.';
});

function updateCraftingUI() {
    craftingGridSlots.forEach((slot, index) => slot.textContent = craftingGrid[index] || '');
}

function checkCraftingRecipes() {
    for (const recipe of recipes) {
        let match = true;
        for (let i = 0; i < 9; i++) if (recipe.pattern[i] !== craftingGrid[i]) { match = false; break; }
        if (match) return recipe.result;
    }
    return null;
}

updateCraftingUI();