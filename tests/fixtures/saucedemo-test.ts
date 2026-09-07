import { test as base } from '@playwright/test';
import { LoginAndMenuPage } from '../pages/login';

type SauceDemoFixtures = {
    loginAndMenuPage: LoginAndMenuPage;
}

export const test = base.extend<SauceDemoFixtures>({
    loginAndMenuPage: async ({ page }, use) => {
        await use(new LoginAndMenuPage(page));
    }
});

export { expect } from '@playwright/test';