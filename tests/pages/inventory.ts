import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly backpackAddButton: Locator;
    readonly backpackRemoveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backpackAddButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.backpackRemoveButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    }
}
