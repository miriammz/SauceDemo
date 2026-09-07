import { test, expect } from '@playwright/test';

test.describe ('SauceDemo', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://saucedemo.com/');
    });

    test('has title', async ({ page }) => {
        await expect(page).toHaveTitle(/Swag Labs/);
    });

    test('has login part', async ({ page }) => {
        await expect(page.locator('[data-test="username"]')).toBeVisible();
        await expect(page.locator('[data-test="password"]')).toBeVisible();
        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });

    test('has accepted usernames and password', async ({ page }) => {
        await expect(page.locator('[data-test="login-credentials"]')).toBeVisible();
        await expect(page.locator('[data-test="login-password"]')).toBeVisible();
    });

    test('login fails with invalid credentials', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('username');
        await page.locator('[data-test="password"]').fill('password');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    test('login succeeds with valid credentials', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory.html/);
    });
});