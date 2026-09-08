import { test, expect } from './fixtures/saucedemo-test';

test.describe ('SauceDemo', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.load();
    });

    test('has title', async ({ page }) => {
        await expect(page).toHaveTitle(/Swag Labs/);
    });

    test('has login part', async ({ loginPage }) => {
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('displays accepted credentials', async ({ loginPage }) => {
        await expect(loginPage.loginCredentials).toBeVisible();
        await expect(loginPage.loginPassword).toBeVisible();
        await expect(loginPage.page.getByRole('heading', { name: 'Accepted usernames are:' })).toBeVisible();
        await expect(loginPage.page.getByRole('heading', { name: 'Password for all users:' })).toBeVisible();
        const acceptedUsernames = [
            'standard_user',
            'locked_out_user',
            'problem_user',
            'performance_glitch_user',
            'error_user',
            'visual_user',
        ];
        for (const username of acceptedUsernames) {
            await expect(loginPage.loginCredentials).toContainText(username);
        }
        await expect(loginPage.loginPassword).toContainText('secret_sauce');
    });

    test('login fails with invalid credentials', async ({ loginPage }) => {
        await loginPage.login('username', 'password');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Username and password do not match any user in this service');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with empty credentials', async ({ loginPage }) => {
        await loginPage.login('', '');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Username is required');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with user empty and password filled', async ({ loginPage }) => {
        await loginPage.login('', 'secret_sauce');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Username is required');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with password empty and user filled', async ({ loginPage }) => {
        await loginPage.login('standard_user', '');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Password is required');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with locked user', async ({ loginPage }) => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Sorry, this user has been locked out.');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login succeeds with valid credentials', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(loginPage.page).toHaveURL(/inventory.html/);
        await expect(menuPage.page.locator('[data-test="title"]')).toHaveText('Products');
    });

    test('menu button and shopping icon are visible after login', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(menuPage.page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
        await expect(menuPage.page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    });

    test('menu button opens menu and has all options', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await menuPage.menu.click();
        await expect(menuPage.page.getByRole('button', { name: 'Close Menu' })).toBeVisible();
        await expect(menuPage.inventory).toBeVisible();
        await expect(menuPage.about).toBeVisible();
        await expect(menuPage.logout).toBeVisible();
        await expect(menuPage.reset).toBeVisible();
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

    test('reset link works', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(menuPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText('Add to cart');
        await menuPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await expect(menuPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText('Remove');
        await expect(menuPage.page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await menuPage.menu.click();
        await menuPage.reset.click();
        //comprobar que se quita el 1 del carrito
        await expect(menuPage.page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
        //comprobar que vuelve a poner Add to cart en el boton del producto
        await expect(menuPage.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText('Add to cart');
    });
});