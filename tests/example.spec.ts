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

    test('displays accepted credentials', async ({ loginAndMenuPage }) => {
        await expect(loginAndMenuPage.loginCredentials).toBeVisible();
        await expect(loginAndMenuPage.loginPassword).toBeVisible();
        await expect(loginAndMenuPage.page.getByRole('heading', { name: 'Accepted usernames are:' })).toBeVisible();
        await expect(loginAndMenuPage.page.getByRole('heading', { name: 'Password for all users:' })).toBeVisible();
        const acceptedUsernames = [
            'standard_user',
            'locked_out_user',
            'problem_user',
            'performance_glitch_user',
            'error_user',
            'visual_user',
        ];
        for (const username of acceptedUsernames) {
            await expect(loginAndMenuPage.loginCredentials).toContainText(username);
        }
        await expect(loginAndMenuPage.loginPassword).toContainText('secret_sauce');
    });

    test('login fails with invalid credentials', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('username', 'password');
        await expect(loginAndMenuPage.error).toBeVisible();
        await expect(loginAndMenuPage.error).toContainText('Epic sadface: Username and password do not match any user in this service');
        await expect(loginAndMenuPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with empty credentials', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('', '');
        await expect(loginAndMenuPage.error).toBeVisible();
        await expect(loginAndMenuPage.error).toContainText('Epic sadface: Username is required');
        await expect(loginAndMenuPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with user empty and password filled', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('', 'secret_sauce');
        await expect(loginAndMenuPage.error).toBeVisible();
        await expect(loginAndMenuPage.error).toContainText('Epic sadface: Username is required');
        await expect(loginAndMenuPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with password empty and user filled', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', '');
        await expect(loginAndMenuPage.error).toBeVisible();
        await expect(loginAndMenuPage.error).toContainText('Epic sadface: Password is required');
        await expect(loginAndMenuPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with locked user', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('locked_out_user', 'secret_sauce');
        await expect(loginAndMenuPage.error).toBeVisible();
        await expect(loginAndMenuPage.error).toContainText('Epic sadface: Sorry, this user has been locked out.');
        await expect(loginAndMenuPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login succeeds with valid credentials', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await expect(loginAndMenuPage.page).toHaveURL(/inventory.html/);
        await expect(loginAndMenuPage.page.locator('[data-test="title"]')).toHaveText('Products');
    });

    test('menu button and shopping icon are visible after login', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await expect(loginAndMenuPage.page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
        await expect(loginAndMenuPage.page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    });

    test('menu button opens menu and has all options', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await loginAndMenuPage.menu.click();
        await expect(loginAndMenuPage.page.getByRole('button', { name: 'Close Menu' })).toBeVisible();
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
        await expect(loginAndMenuPage.usernameInput).toBeVisible();
        await expect(loginAndMenuPage.loginButton).toBeVisible();
    });

    test('reset link works', async ({ loginAndMenuPage }) => {
        await loginAndMenuPage.login('standard_user', 'secret_sauce');
        await expect(loginAndMenuPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText('Add to cart');
        await loginAndMenuPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await expect(loginAndMenuPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText('Remove');
        await expect(loginAndMenuPage.page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await loginAndMenuPage.menu.click();
        await loginAndMenuPage.reset.click();
        //comprobar que se quita el 1 del carrito
        await expect(loginAndMenuPage.page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
        //comprobar que vuelve a poner Add to cart en el boton del producto
        await expect(loginAndMenuPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText('Add to cart');
    });
});