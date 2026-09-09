import { test, expect } from './fixtures/saucedemo-test';

test.describe('SauceDemo Menu', () => { 
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.load();
    });

    test('menu button, shopping icon, inventory part and filter are visible after login', async ({ loginPage, menuPage, cartPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(menuPage.menu).toBeVisible();
        await expect(cartPage.cartLink).toBeVisible();
        await expect(inventoryPage.container).toBeVisible();
        await expect(inventoryPage.sort).toBeVisible();
        await expect(inventoryPage.activeOption).toHaveText('Name (A to Z)');
    });

    test('menu button opens menu and has all options', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await menuPage.menu.click();
        await expect(menuPage.menu).toBeVisible();
        await expect(menuPage.inventory).toBeVisible();
        await expect(menuPage.about).toBeVisible();
        await expect(menuPage.logout).toBeVisible();
        await expect(menuPage.reset).toBeVisible();
    });

    test('inventory link works', async ({ loginPage, menuPage, inventoryPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await cartPage.cartLink.click();
        await expect(cartPage.page).toHaveURL(/cart.html/);
        await menuPage.menu.click();
        await menuPage.inventory.click();
        await expect(inventoryPage.page).toHaveURL(/inventory.html/);
    });

    test('about link works', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await menuPage.menu.click();
        await menuPage.about.click();
        await expect(menuPage.page).toHaveURL(/saucelabs.com/);
    });

    test('logout link works', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await menuPage.menu.click();
        await menuPage.logout.click();
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('reset link works', async ({ loginPage, menuPage, cartPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
        await inventoryPage.backpackAddButton.click();
        await expect(inventoryPage.backpackRemoveButton).toHaveText('Remove');
        await expect(cartPage.cartBadge).toHaveText('1');
        await menuPage.menu.click();
        await menuPage.reset.click();
        //comprobar que se quita el 1 del carrito
        await expect(cartPage.cartBadge).not.toBeVisible();
        //comprobar que el estado reseteado persiste tras recargar
        await inventoryPage.page.reload();
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
    });
});