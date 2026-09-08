import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly backpack: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    }
}
