import { test, expect } from './fixtures/saucedemo-test';

test.describe('SauceDemo Cart', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.load();
    });

    test('cart icon works', async ({ loginPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(cartPage.cartBadge).not.toBeVisible();
        await cartPage.cartLink.click();
        await expect(cartPage.page).toHaveURL(/cart.html/);
        await expect(cartPage.title).toHaveText('Your Cart');
    });

    test('add items to cart', async ({ loginPage, inventoryPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
        await inventoryPage.backpackAddButton.click();
        await expect(cartPage.cartBadge).toHaveText('1');
        await expect(inventoryPage.fleeceJacketAddButton).toHaveText('Add to cart');
        await inventoryPage.fleeceJacketAddButton.click();
        await expect(cartPage.cartBadge).toHaveText('2');
        await expect(inventoryPage.backpackRemoveButton).toHaveText('Remove');
        await expect(inventoryPage.fleeceJacketRemoveButton).toHaveText('Remove');
        await cartPage.cartLink.click();
        await expect(cartPage.page).toHaveURL(/cart.html/);
        await expect(cartPage.cartItems).toHaveCount(2);
    });

    test('remove item from inventory', async ({ loginPage, inventoryPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
        await inventoryPage.backpackAddButton.click();
        await expect(cartPage.cartBadge).toHaveText('1');
        await expect(inventoryPage.backpackRemoveButton).toHaveText('Remove');
        await inventoryPage.backpackRemoveButton.click();
        await expect(cartPage.cartBadge).not.toBeVisible();
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
    });

    test('remove item from cart with some products', async ({ loginPage, menuPage, inventoryPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
        await inventoryPage.backpackAddButton.click();
        await expect(inventoryPage.fleeceJacketAddButton).toHaveText('Add to cart');
        await inventoryPage.fleeceJacketAddButton.click();
        await expect(cartPage.cartBadge).toHaveText('2');
        await cartPage.cartLink.click();
        await expect(cartPage.page).toHaveURL(/cart.html/);
        await expect(cartPage.cartItems).toHaveCount(2);
        await inventoryPage.backpackRemoveButton.click();
        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.cartBadge).toHaveText('1');
        await menuPage.menu.click();
        await menuPage.inventory.click();
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
        await expect(inventoryPage.fleeceJacketRemoveButton).toHaveText('Remove');
    });

    test('remove item from cart with one product', async ({ loginAndAddItemsToCart, menuPage, inventoryPage, cartPage }) => {
        await loginAndAddItemsToCart();
        await inventoryPage.backpackRemoveButton.click();
        await expect(cartPage.cartItems).not.toBeVisible();
        await expect(cartPage.cartBadge).not.toBeVisible();
        await menuPage.menu.click();
        await menuPage.inventory.click();
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
    });

    test('continue shopping button works', async ({ loginAndAddItemsToCart, inventoryPage, cartPage }) => {
        await loginAndAddItemsToCart();
        await cartPage.continueButton.click();
        await expect(inventoryPage.page).toHaveURL(/inventory.html/);
        await expect(inventoryPage.backpackRemoveButton).toHaveText('Remove');
    });
});