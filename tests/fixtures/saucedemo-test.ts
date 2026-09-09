import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { MenuPage } from '../pages/menu';
import { CartPage } from '../pages/cart';
import { InventoryPage } from '../pages/inventory';
import { CheckoutPage } from '../pages/checkout';

type SauceDemoFixtures = {
    loginPage: LoginPage;
    menuPage: MenuPage;
    cartPage: CartPage;
    inventoryPage: InventoryPage;
    checkoutPage: CheckoutPage;
    loginAndAddItemsToCart: () => Promise<void>;
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
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    loginAndAddItemsToCart: async ({ loginPage, inventoryPage, cartPage }, use) => {
        await use(async () => {
            await loginPage.login('standard_user', 'secret_sauce');
            await inventoryPage.backpackAddButton.click();
            await cartPage.cartLink.click();
        });
    }
});

export { expect } from '@playwright/test';