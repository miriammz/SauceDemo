import { type Locator, type Page } from '@playwright/test';

export class MenuPage {
    readonly page: Page;
    readonly menu: Locator;
    readonly menuClosed: Locator;
    readonly inventory: Locator;
    readonly about: Locator;
    readonly logout: Locator;
    readonly reset: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menu = page.getByRole('button', { name: 'Open Menu' });
        this.menuClosed = page.getByRole('button', { name: 'Close Menu' });
        this.inventory = page.locator('[data-test="inventory-sidebar-link"]');
        this.about = page.locator('[data-test="about-sidebar-link"]');
        this.logout = page.locator('[data-test="logout-sidebar-link"]');
        this.reset = page.locator('[data-test="reset-sidebar-link"]');
    }
}
