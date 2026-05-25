import { expect } from '@playwright/test';
import { test } from '@fixtures/app.js';
import { validCustomer } from '../test_data/validCustomer.js';

test('Verify user can add product to cart', async ({ app, page }) => {
  const productName = 'Slip Joint Pliers';

  await test.step('Navigate to product page', async () => {
    await app.homePage.navigate();
    await expect(app.homePage.productNames.first()).toBeVisible();

    const productPriceValue =
      await app.homePage.getProductPriceValue(productName);
    await app.homePage.clickProductCard(productName);

    await expect(page).toHaveURL(/\/product\/[A-Z0-9]+/);
    await expect(app.productPage.productPageTitle).toContainText(productName);
    await expect(app.productPage.productPrice).toContainText(productPriceValue);
  });

  await test.step('Add product to cart', async () => {
    await app.productPage.addToCartButton.click();
    await expect(app.productPage.addToCartAlert).toBeVisible();
    await expect(app.productPage.addToCartAlert).toBeHidden({
      timeout: 8000,
    });
    await expect(app.productPage.header.cartCounter).toHaveText('1');
  });

  await test.step('Verify cart', async () => {
    await app.productPage.header.clickCartItem();

    await expect(page).toHaveURL('/checkout');
    await expect(app.checkoutPage.cart.productTitle).toHaveText(productName);
    await expect(app.checkoutPage.cart.productQuantity).toHaveValue('1');
    await expect(app.checkoutPage.cart.proceedToCheckoutButton).toBeVisible();
  });
});

test('Verify chekout user flow', async ({ loggedInApp, page }) => {
  // comment to test ci
  await loggedInApp.homePage.navigate();

  await expect
    .poll(
      async () => {
        const items = await loggedInApp.homePage.getProductData('name');
        return items?.[0];
      },
      {
        message: 'First product not found',
        timeout: 5000,
      },
    )
    .toBeDefined();

  const firstProduct = await loggedInApp.homePage.getFirstProductData();

  await loggedInApp.homePage.clickProductCard(firstProduct.name);
  await expect(page).toHaveURL(/\/product\/[A-Z0-9]+/);
  await expect(loggedInApp.productPage.productPageTitle).toContainText(
    firstProduct.name,
  );

  await loggedInApp.productPage.addToCartButton.click();
  await expect(loggedInApp.productPage.header.cartCounter).toHaveText('1');

  await loggedInApp.productPage.header.clickCartItem();
  await expect(page).toHaveURL('/checkout');
  await expect(loggedInApp.checkoutPage.currentStepLabel).toHaveText('Cart');
  await expect(loggedInApp.checkoutPage.cart.productTitle).toContainText(
    firstProduct.name,
  );
  await expect(loggedInApp.checkoutPage.cart.productPrice).toContainText(
    '$' + `${firstProduct.price}`,
  );
  await expect(loggedInApp.checkoutPage.cart.rowTotalPrice).toContainText(
    '$' + `${firstProduct.price}`,
  );

  await loggedInApp.checkoutPage.cart.proceedToCheckoutButton.click();

  const expectedGreetingMessage =
    loggedInApp.checkoutPage.signIn.getExpectedGreeting(validCustomer.fullName);

  await expect(loggedInApp.checkoutPage.signIn.greetingMessage).toHaveText(
    expectedGreetingMessage,
  );

  await loggedInApp.checkoutPage.signIn.proceedToCheckoutButton.click();
  await expect(loggedInApp.checkoutPage.currentStepLabel).toHaveText(
    'Billing Address',
  );

  await loggedInApp.checkoutPage.billingAddress.countrySelect.selectOption(
    validCustomer.country,
  );
  await loggedInApp.checkoutPage.billingAddress.postalCodeInput.fill(
    validCustomer.postalCode,
  );
  await loggedInApp.checkoutPage.billingAddress.houseNumberInput.fill(
    validCustomer.houseNumber,
  );

  await expect(
    loggedInApp.checkoutPage.billingAddress.countrySelect,
  ).toHaveValue(validCustomer.countryCode);
  await expect(
    loggedInApp.checkoutPage.billingAddress.postalCodeInput,
  ).toHaveValue(validCustomer.postalCode);
  await expect(
    loggedInApp.checkoutPage.billingAddress.houseNumberInput,
  ).toHaveValue(validCustomer.houseNumber);
  await expect(loggedInApp.checkoutPage.billingAddress.streetInput).toHaveValue(
    /^Test street \d+$/,
  );
  await expect(loggedInApp.checkoutPage.billingAddress.cityInput).toHaveValue(
    /^[a-zA-Z]+$/,
  );
  await expect(loggedInApp.checkoutPage.billingAddress.stateInput).toHaveValue(
    /^[a-zA-Z]+$/,
  );

  await loggedInApp.checkoutPage.billingAddress.proceedToCheckoutButton.click();
  await expect(loggedInApp.checkoutPage.currentStepLabel).toHaveText('Payment');

  await loggedInApp.checkoutPage.payment.paymentMethodSelect.selectOption(
    validCustomer.paymentMethod,
  );
  await loggedInApp.checkoutPage.payment.creditCardNumberInput.fill(
    validCustomer.cardNumber,
  );
  await loggedInApp.checkoutPage.payment.cardHolderNameInput.fill(
    validCustomer.cardHolderName,
  );
  await loggedInApp.checkoutPage.payment.expirationDateInput.fill(
    validCustomer.expirationDate,
  );
  await loggedInApp.checkoutPage.payment.cvvInput.fill(validCustomer.cvv);

  await loggedInApp.checkoutPage.payment.confirmButton.click();
  await expect(
    loggedInApp.checkoutPage.payment.paymentSuccessMessageAlert,
  ).toHaveText('Payment was successful');
});
