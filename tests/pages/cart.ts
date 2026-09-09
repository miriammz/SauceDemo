import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;
    readonly cartItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartItems = page.locator('[data-test="inventory-item"]');
    }

    async form(firstName: string, lastName: string, postalCode: string) {
        await this.page.locator('[data-test="firstName"]').fill(firstName);
        await this.page.locator('[data-test="lastName"]').fill(lastName);
        await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    }

    async expectError(errorMessage: string) {
        await this.page.locator('[data-test="continue"]').click();
        await expect(this.page.locator('[data-test="error"]')).toBeVisible();
        await expect(this.page.locator('[data-test="error"]')).toHaveText(errorMessage);
    }
}
