import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly backpackAddButton: Locator;
    readonly backpackRemoveButton: Locator;
    readonly sort: Locator;
    readonly item: Locator;
    readonly price: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly bikeLightAddButton: Locator;
    readonly boltTShirtAddButton: Locator;
    readonly fleeceJacketAddButton: Locator;
    readonly onesieAddButton: Locator;
    readonly allTheThingsAddButton: Locator;
    readonly bikeLightRemoveButton: Locator;
    readonly boltTShirtRemoveButton: Locator;
    readonly fleeceJacketRemoveButton: Locator;
    readonly onesieRemoveButton: Locator;
    readonly allTheThingsRemoveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backpackAddButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.bikeLightAddButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
        this.boltTShirtAddButton = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
        this.fleeceJacketAddButton = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
        this.onesieAddButton = page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');
        this.allTheThingsAddButton = page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
        this.backpackRemoveButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
        this.bikeLightRemoveButton = page.locator('[data-test="remove-sauce-labs-bike-light"]');
        this.boltTShirtRemoveButton = page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]');
        this.fleeceJacketRemoveButton = page.locator('[data-test="remove-sauce-labs-fleece-jacket"]');
        this.onesieRemoveButton = page.locator('[data-test="remove-sauce-labs-onesie"]');
        this.allTheThingsRemoveButton = page.locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]');
        this.sort = page.locator('[data-test="product-sort-container"]');
        this.item = page.locator('.inventory_item');
        this.price = page.locator('.inventory_item_price');
        this.name = page.locator('.inventory_item_name');
        this.description = page.locator('.inventory_item_desc');
    }
}
