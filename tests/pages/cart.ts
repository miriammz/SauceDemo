import { type Locator, type Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;
    readonly title: Locator;
    readonly continueButton: Locator;
    readonly cartItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.title = page.locator('[data-test="title"]');
        this.continueButton = page.locator('[data-test="continue-shopping"]');
        this.cartItems = page.locator('[data-test="inventory-item"]');
    }
}
