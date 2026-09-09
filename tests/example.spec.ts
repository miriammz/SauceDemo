import { test, expect } from './fixtures/saucedemo-test';
import { LoginPage } from './pages/login';
import { InventoryPage } from './pages/inventory';
import { CartPage } from './pages/cart';
import { CheckoutPage } from './pages/checkout';

async function loginAndAddItemsToCart({loginPage, inventoryPage, cartPage}: 
    {loginPage: LoginPage, inventoryPage: InventoryPage, cartPage: CartPage}) {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
    await inventoryPage.backpackAddButton.click();
    await expect(cartPage.cartBadge).toHaveText('1');
    await cartPage.cartLink.click();
    await expect(cartPage.page).toHaveURL(/cart.html/);
    await expect(cartPage.cartItems).toHaveCount(1);
}

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

test.describe ('SauceDemo', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.load();
    });

    test('has title', async ({ page }) => {
        await expect(page).toHaveTitle(/Swag Labs/);
    });

    test('has login part', async ({ loginPage }) => {
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('displays accepted credentials', async ({ loginPage }) => {
        await expect(loginPage.loginCredentials).toBeVisible();
        await expect(loginPage.loginPassword).toBeVisible();
        await expect(loginPage.page.getByRole('heading', { name: 'Accepted usernames are:' })).toBeVisible();
        await expect(loginPage.page.getByRole('heading', { name: 'Password for all users:' })).toBeVisible();
        const acceptedUsernames = [
            'standard_user',
            'locked_out_user',
            'problem_user',
            'performance_glitch_user',
            'error_user',
            'visual_user',
        ];
        for (const username of acceptedUsernames) {
            await expect(loginPage.loginCredentials).toContainText(username);
        }
        await expect(loginPage.loginPassword).toContainText('secret_sauce');
    });

    test('login fails with invalid credentials', async ({ loginPage }) => {
        await loginPage.login('username', 'password');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Username and password do not match any user in this service');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with empty credentials', async ({ loginPage }) => {
        await loginPage.login('', '');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Username is required');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with user empty and password filled', async ({ loginPage }) => {
        await loginPage.login('', 'secret_sauce');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Username is required');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with password empty and user filled', async ({ loginPage }) => {
        await loginPage.login('standard_user', '');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Password is required');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login fails with locked user', async ({ loginPage }) => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toContainText('Epic sadface: Sorry, this user has been locked out.');
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
    });

    test('login succeeds with valid credentials', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(loginPage.page).toHaveURL(/inventory.html/);
        await expect(menuPage.page.locator('[data-test="title"]')).toHaveText('Products');
    });

    test('menu button, shopping icon, inventory part and filter are visible after login', async ({ loginPage, menuPage, cartPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(menuPage.menu).toBeVisible();
        await expect(cartPage.cartLink).toBeVisible();
        await expect(inventoryPage.container).toBeVisible();
        await expect(inventoryPage.sort).toBeVisible();
        await expect(inventoryPage.activeOption).toHaveText('Name (A to Z)');
    });

    test('menu button opens menu and has all options', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await menuPage.menu.click();
        await expect(menuPage.menu).toBeVisible();
        await expect(menuPage.inventory).toBeVisible();
        await expect(menuPage.about).toBeVisible();
        await expect(menuPage.logout).toBeVisible();
        await expect(menuPage.reset).toBeVisible();
    });

    test('inventory link works', async ({ loginPage, menuPage, inventoryPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await cartPage.cartLink.click();
        await expect(cartPage.page).toHaveURL(/cart.html/);
        await menuPage.menu.click();
        await menuPage.inventory.click();
        await expect(inventoryPage.page).toHaveURL(/inventory.html/);
    });

    test('about link works', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await menuPage.menu.click();
        await menuPage.about.click();
        await expect(menuPage.page).toHaveURL(/saucelabs.com/);
    });

    test('logout link works', async ({ loginPage, menuPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await menuPage.menu.click();
        await menuPage.logout.click();
        await expect(loginPage.page).toHaveURL(/saucedemo.com/);
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('reset link works', async ({ loginPage, menuPage, cartPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
        await inventoryPage.backpackAddButton.click();
        await expect(inventoryPage.backpackRemoveButton).toHaveText('Remove');
        await expect(cartPage.cartBadge).toHaveText('1');
        await menuPage.menu.click();
        await menuPage.reset.click();
        //comprobar que se quita el 1 del carrito
        await expect(cartPage.cartBadge).not.toBeVisible();
        //comprobar que el estado reseteado persiste tras recargar
        await inventoryPage.page.reload();
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
    });

    test('cart icon works', async ({ loginPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(cartPage.cartBadge).not.toBeVisible();
        await cartPage.cartLink.click();
        await expect(cartPage.page).toHaveURL(/cart.html/);
        await expect(cartPage.title).toHaveText('Your Cart');
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

    test('add items to cart', async ({ loginPage, inventoryPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.backpackAddButton.click();
        await expect(cartPage.cartBadge).toHaveText('1');
        await inventoryPage.fleeceJacketAddButton.click();
        await expect(cartPage.cartBadge).toHaveText('2');
        await expect(inventoryPage.backpackRemoveButton).toHaveText('Remove');
        await expect(inventoryPage.fleeceJacketRemoveButton).toHaveText('Remove');
    });

    test('remove item from inventory', async ({ loginPage, inventoryPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
        await inventoryPage.backpackAddButton.click();
        await expect(cartPage.cartBadge).toHaveText('1');
        await expect(inventoryPage.backpackRemoveButton).toHaveText('Remove');
        await inventoryPage.backpackRemoveButton.click();
        await expect(cartPage.cartBadge).not.toBeVisible();
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
    });

    test('remove item from cart with some products', async ({ loginPage, menuPage, inventoryPage, cartPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
        await inventoryPage.backpackAddButton.click();
        await expect(inventoryPage.fleeceJacketAddButton).toHaveText('Add to cart');
        await inventoryPage.fleeceJacketAddButton.click();
        await expect(cartPage.cartBadge).toHaveText('2');
        await cartPage.cartLink.click();
        await expect(cartPage.page).toHaveURL(/cart.html/);
        await expect(cartPage.cartItems).toHaveCount(2);
        await inventoryPage.backpackRemoveButton.click();
        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.cartBadge).toHaveText('1');
        await menuPage.menu.click();
        await menuPage.inventory.click();
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
        await expect(inventoryPage.fleeceJacketRemoveButton).toHaveText('Remove');
    });

    test('remove item from cart with one product', async ({ loginPage, menuPage, inventoryPage, cartPage }) => {
        await loginAndAddItemsToCart({loginPage, inventoryPage, cartPage});
        await inventoryPage.backpackRemoveButton.click();
        await expect(cartPage.cartItems).not.toBeVisible();
        await expect(cartPage.cartBadge).not.toBeVisible();
        await menuPage.menu.click();
        await menuPage.inventory.click();
        await expect(inventoryPage.backpackAddButton).toHaveText('Add to cart');
    });

    test('continue shopping button works', async ({ loginPage, inventoryPage, cartPage }) => {
        await loginAndAddItemsToCart({loginPage, inventoryPage, cartPage});
        await cartPage.continueButton.click();
        await expect(inventoryPage.page).toHaveURL(/inventory.html/);
        await expect(inventoryPage.backpackRemoveButton).toHaveText('Remove');
    });

    test('checkout flow works', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
        await loginAndAddItemsToCart({loginPage, inventoryPage, cartPage});
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.form('John', 'Doe', '12345');
        await goToCheckoutStepTwo({checkoutPage});
        await goToCheckoutComplete({checkoutPage});
    });

    test('checkout flow fails with missing info', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
        await loginAndAddItemsToCart({loginPage, inventoryPage, cartPage});
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.form('', '', '');
        await checkoutPage.expectError('Error: First Name is required');
        await checkoutPage.form('John', '', '');
        await checkoutPage.expectError('Error: Last Name is required');
        await checkoutPage.form('John', 'Doe', '');
        await checkoutPage.expectError('Error: Postal Code is required');
    });

    test('cancel checkout flow works first step', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
        await loginAndAddItemsToCart({loginPage, inventoryPage, cartPage});
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.cancelButton.click();
        await expect(checkoutPage.page).toHaveURL(/cart.html/);
    });

    test('cancel checkout flow works second step', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
        await loginAndAddItemsToCart({loginPage, inventoryPage, cartPage});
        await goToCheckoutStepOne({checkoutPage});
        await checkoutPage.form('John', 'Doe', '12345');
        await goToCheckoutStepTwo({checkoutPage});
        await checkoutPage.cancelButton.click();
        await expect(checkoutPage.page).toHaveURL(/inventory.html/);
    });

    test('summary validation', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
        await loginAndAddItemsToCart({loginPage, inventoryPage, cartPage});
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

    test('last step validation', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
        await loginAndAddItemsToCart({loginPage, inventoryPage, cartPage});
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