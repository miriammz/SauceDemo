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

    test('has accepted usernames and password', async ({ loginPage }) => {
        await expect(loginPage.loginCredentials).toBeVisible();
        await expect(loginPage.loginPassword).toBeVisible();
    });

    test('login fails with invalid credentials', async ({ loginPage }) => {
        await loginPage.usernameInput.fill('username');
        await loginPage.passwordInput.fill('password');
        await loginPage.loginButton.click();
        await expect(loginPage.page.locator('[data-test="error"]')).toBeVisible();
    });

    test('login succeeds with valid credentials', async ({ loginPage }) => {
        await loginPage.usernameInput.fill('standard_user');
        await loginPage.passwordInput.fill('secret_sauce');
        await loginPage.loginButton.click();
        await expect(loginPage.page).toHaveURL(/inventory.html/);
    });

    test('menu button and shopping icon are visible after login', async ({ loginPage }) => {
        await loginPage.usernameInput.fill('standard_user');
        await loginPage.passwordInput.fill('secret_sauce');
        await loginPage.loginButton.click();
        await expect(loginPage.page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
        await expect(loginPage.page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    });
});