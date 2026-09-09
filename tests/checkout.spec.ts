import { test, expect } from './fixtures/saucedemo-test';
import { CheckoutPage } from './pages/checkout';

async function goToCheckoutStepOne({checkoutPage}: {checkoutPage: CheckoutPage}) {
    await checkoutPage.checkoutButton.click();
    await expect(checkoutPage.page).toHaveURL(/checkout-step-one.html/);
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
}

async function goToCheckoutStepTwo({checkoutPage}: {checkoutPage: CheckoutPage}) {
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.page).toHaveURL(/checkout-step-two.html/);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
}

async function goToCheckoutComplete({checkoutPage}: {checkoutPage: CheckoutPage}) {
    await checkoutPage.finishButton.click();
    await expect(checkoutPage.page).toHaveURL(/checkout-complete.html/);
    await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
}

test.describe('SauceDemo Checkout', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.load();
    });

    test('checkout flow works', async ({ loginAndAddItemsToCart, checkoutPage }) => {
        await loginAndAddItemsToCart();
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.form('John', 'Doe', '12345');
        await goToCheckoutStepTwo({checkoutPage});
        await goToCheckoutComplete({checkoutPage});
    });

    test('checkout flow fails with missing info', async ({ loginAndAddItemsToCart, checkoutPage }) => {
        await loginAndAddItemsToCart();
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.form('', '', '');
        await checkoutPage.expectError('Error: First Name is required');
        await checkoutPage.form('John', '', '');
        await checkoutPage.expectError('Error: Last Name is required');
        await checkoutPage.form('John', 'Doe', '');
        await checkoutPage.expectError('Error: Postal Code is required');
    });

    test('cancel checkout flow works first step', async ({ loginAndAddItemsToCart, checkoutPage }) => {
        await loginAndAddItemsToCart();
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.cancelButton.click();
        await expect(checkoutPage.page).toHaveURL(/cart.html/);
    });

    test('cancel checkout flow works second step', async ({ loginAndAddItemsToCart, checkoutPage }) => {
        await loginAndAddItemsToCart();
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.form('John', 'Doe', '12345');
        await goToCheckoutStepTwo({checkoutPage});
        await checkoutPage.cancelButton.click();
        await expect(checkoutPage.page).toHaveURL(/inventory.html/);
    });

    test('summary validation', async ({ loginAndAddItemsToCart, checkoutPage }) => {
        await loginAndAddItemsToCart();
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.form('John', 'Doe', '12345');
        await goToCheckoutStepTwo({checkoutPage});
        const itemTotal = await checkoutPage.subtotal.textContent();
        const tax = await checkoutPage.tax.textContent();
        const total = await checkoutPage.total.textContent();
        const itemTotalValue = parseFloat(itemTotal?.replace('Item total: $', '') || '0');
        const taxValue = parseFloat(tax?.replace('Tax: $', '') || '0');
        const totalValue = parseFloat(total?.replace('Total: $', '') || '0');
        expect(totalValue).toBeCloseTo(itemTotalValue + taxValue, 2);
    });

    test('last step validation', async ({ loginAndAddItemsToCart, checkoutPage }) => {
        await loginAndAddItemsToCart();
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.form('John', 'Doe', '12345');
        await goToCheckoutStepTwo({checkoutPage});
        await goToCheckoutComplete({checkoutPage});
        await expect(checkoutPage.tick).toBeVisible();
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
        await expect(checkoutPage.completeText).toContainText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
        await expect(checkoutPage.backButton).toBeVisible();
        await expect(checkoutPage.pdf).toBeVisible();
    });
});