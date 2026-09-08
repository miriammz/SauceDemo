import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { MenuPage } from '../pages/menu';

type SauceDemoFixtures = {
    loginPage: LoginPage;
    menuPage: MenuPage;
}

export const test = base.extend<SauceDemoFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    menuPage: async ({ page }, use) => {
        await use(new MenuPage(page));
    }
});

export { expect } from '@playwright/test';