import { test, expect } from './fixtures/saucedemo-test';

test.describe('SauceDemo Login', () => {
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
});