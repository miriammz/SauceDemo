import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly checkoutButton: Locator;
    readonly title: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;
    readonly tick: Locator;
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly backButton: Locator;
    readonly pdf: Locator;
    readonly subtotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.title = page.locator('[data-test="title"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.tick = page.locator('[data-test="pony-express"]');
        this.completeHeader = page.locator('[data-test=complete-header]');
        this.completeText = page.locator('[data-test="complete-text"]');
        this.backButton = page.locator('[data-test="back-to-products"]');
        this.pdf = page.locator('[data-test="generate-pdf-order"]');
        this.subtotal = page.locator('[data-test="subtotal-label"]');
        this.tax = page.locator('[data-test="tax-label"]');
        this.total = page.locator('[data-test="total-label"]');
    }

    async form(firstName: string, lastName: string, postalCode: string) {
        await this.page.locator('[data-test="firstName"]').fill(firstName);
        await this.page.locator('[data-test="lastName"]').fill(lastName);
        await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    }

    async expectError(errorMessage: string) {
        await this.page.locator('[data-test="continue"]').click();
        await expect(this.page.locator('[data-test="error"]')).toBeVisible();
        await expect(this.page.locator('[data-test="error"]')).toHaveText(errorMessage);
    }
}
