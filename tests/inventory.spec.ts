import { test, expect } from './fixtures/saucedemo-test';

test.describe('SauceDemo Inventory', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.load();
    });

    test('each product has a name, description, price, image and add to cart button', async ({ loginPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        const products = inventoryPage.item;
        await expect(products).toHaveCount(6);
        await expect(inventoryPage.name).toHaveCount(6);
        await expect(inventoryPage.description).toHaveCount(6);
        await expect(inventoryPage.price).toHaveCount(6);
        await expect(inventoryPage.item.locator('img')).toHaveCount(6);
        await expect(inventoryPage.backpackAddButton).toHaveCount(1);
        await expect(inventoryPage.bikeLightAddButton).toHaveCount(1);
        await expect(inventoryPage.boltTShirtAddButton).toHaveCount(1);
        await expect(inventoryPage.fleeceJacketAddButton).toHaveCount(1);
        await expect(inventoryPage.onesieAddButton).toHaveCount(1);
        await expect(inventoryPage.allTheThingsAddButton).toHaveCount(1);
    });

    test('products shown by default are sorted by name A to Z', async ({ loginPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        const productNames = await inventoryPage.name.allTextContents();
        const sortedProductNames = [...productNames].sort();
        expect(productNames).toEqual(sortedProductNames);
    });

    test('products sorted by name Z to A', async ({ loginPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.sort.selectOption('za');
        const productNames = await inventoryPage.name.allTextContents();
        const sortedProductNames = [...productNames].sort().reverse();
        expect(productNames).toEqual(sortedProductNames);
    });

    test('products sorted by price low to high', async ({ loginPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.sort.selectOption('lohi');
        const productPrices = await inventoryPage.price.allTextContents();
        const productPricesNumbers = productPrices.map(price => parseFloat(price.replace('$', '')));
        const sortedProductPricesNumbers = [...productPricesNumbers].sort((a, b) => a - b);
        expect(productPricesNumbers).toEqual(sortedProductPricesNumbers);
    });

    test('products sorted by price high to low', async ({ loginPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.sort.selectOption('hilo');
        const productPrices = await inventoryPage.price.allTextContents();
        const productPricesNumbers = productPrices.map(price => parseFloat(price.replace('$', '')));
        const sortedProductPricesNumbers = [...productPricesNumbers].sort((a, b) => b - a);
        expect(productPricesNumbers).toEqual(sortedProductPricesNumbers);
    });
});