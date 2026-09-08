import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { MenuPage } from '../pages/menu';
import { CartPage } from '../pages/cart';
import { InventoryPage } from '../pages/inventory';

type SauceDemoFixtures = {
    loginPage: LoginPage;
    menuPage: MenuPage;
    cartPage: CartPage;
    inventoryPage: InventoryPage;
}

export const test = base.extend<SauceDemoFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    menuPage: async ({ page }, use) => {
        await use(new MenuPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    }
});

export { expect } from '@playwright/test';