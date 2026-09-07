import { test, expect } from './fixtures/saucedemo-test';

test.describe ('SauceDemo', () => {

    test.beforeEach(async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.load();
    });

    test('has title', async ({ page }) => {
        await expect(page).toHaveTitle(/Swag Labs/);
    });

    test('has login part', async ({ loginAndMenuPage }) => {
        await expect(loginAndMenuPage.usernameInput).toBeVisible();
        await expect(loginAndMenuPage.passwordInput).toBeVisible();
        await expect(loginAndMenuPage.loginButton).toBeVisible();
    });

    test('has accepted usernames and password', async ({ loginAndMenuPage }) => {
        await expect(loginAndMenuPage.loginCredentials).toBeVisible();
        await expect(loginAndMenuPage.loginPassword).toBeVisible();
    });

    test('login fails with invalid credentials', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('username', 'password');
        await expect(loginAndMenuPage.page.locator('[data-test="error"]')).toBeVisible();
    });

    test('login succeeds with valid credentials', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await expect(loginAndMenuPage.page).toHaveURL(/inventory.html/);
    });

    test('menu button and shopping icon are visible after login', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await expect(loginAndMenuPage.page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
        await expect(loginAndMenuPage.page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    });

    test('menu button opens menu and has all options', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await loginAndMenuPage.menu.click();
        await expect(loginAndMenuPage.inventory).toBeVisible();
        await expect(loginAndMenuPage.about).toBeVisible();
        await expect(loginAndMenuPage.logout).toBeVisible();
        await expect(loginAndMenuPage.reset).toBeVisible();
    });

    test('about link works', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await loginAndMenuPage.menu.click();
        await loginAndMenuPage.about.click();
        await expect(loginAndMenuPage.page).toHaveURL(/saucelabs.com/);
    });

    test('logout link works', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await loginAndMenuPage.menu.click();
        await loginAndMenuPage.logout.click();
        await expect(loginAndMenuPage.page).toHaveURL(/saucedemo.com/);
    });

    test('reset link works', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await loginAndMenuPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await loginAndMenuPage.page.locator('[data-test="shopping-cart-link"]').click();
        await expect(loginAndMenuPage.page.locator('[data-test="inventory-item"]')).toBeVisible();
        await loginAndMenuPage.menu.click();
        await loginAndMenuPage.reset.click();
        //comprobar que se quita el 1 del carrito
        await expect(loginAndMenuPage.page.locator('[data-test="inventory-item"]')).not.toBeVisible();
    });
});