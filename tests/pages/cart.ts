import { type Locator, type Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cart: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cart = page.locator('[data-test="shopping-cart-link"]');
    }
}
