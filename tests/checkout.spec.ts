import { expect } from '@playwright/test';
import { test } from '@fixtures/appPages.js';
import { config } from 'dotenv';
import { PaymentMethods } from '@enums/payment-methods.js';

config({ path: '.env.local' });

const validCustomer = {
  fullName: process.env.VALID_CUSTOMER_FULL_NAME as string,
  country: 'Austria',
  countryCode: 'AT',
  postalCode: '00000',
  houseNumber: '11',
  paymentMethod: PaymentMethods.CREDIT_CARD,
  cardNumber: '1111-1111-1111-1111',
  cardHolderName: process.env.VALID_CUSTOMER_FULL_NAME as string,
  expirationDate: new Date(
    new Date().setMonth(new Date().getMonth() + 3),
  ).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }),
  cvv: '111',
};

test('Verify user can add product to cart', async ({ allPages, page }) => {
  const productName = 'Slip Joint Pliers';

  await test.step('Navigate to product page', async () => {
    await allPages.homePage.navigate();
    await expect(allPages.homePage.productNames.first()).toBeVisible();

    const productPriceValue =
      await allPages.homePage.getProductPriceValue(productName);
    await allPages.homePage.clickProductCard(productName);

    await expect(page).toHaveURL(/\/product\/[A-Z0-9]+/);
    await expect(allPages.productPage.productPageTitle).toContainText(
      productName,
    );
    await expect(allPages.productPage.productPrice).toContainText(
      productPriceValue,
    );
  });

  await test.step('Add product to cart', async () => {
    await allPages.productPage.addToCartButton.click();
    await expect(allPages.productPage.addToCartAlert).toBeVisible();
    await expect(allPages.productPage.addToCartAlert).toBeHidden({
      timeout: 8000,
    });
    await expect(allPages.productPage.header.cartCounter).toHaveText('1');
  });

  await test.step('Verify cart', async () => {
    await allPages.productPage.header.clickCartItem();

    await expect(page).toHaveURL('/checkout');
    await expect(allPages.checkoutPage.cart.productTitle).toHaveText(
      productName,
    );
    await expect(allPages.checkoutPage.cart.productQuantity).toHaveValue('1');
    await expect(
      allPages.checkoutPage.cart.proceedToCheckoutButton,
    ).toBeVisible();
  });
});

test('Verify chekout user flow', async ({ loggedInPage, page }) => {
  await loggedInPage.homePage.navigate();
  
  await expect
    .poll(
      async () => {
        const items = await loggedInPage.homePage.getProductData('name');
        return items?.[0];
      },
      {
        message: 'First product not found',
        timeout: 5000,
      },
    )
    .toBeDefined();

  const firstProduct = await loggedInPage.homePage.getFirstProductData();

  await loggedInPage.homePage.clickProductCard(firstProduct.name);
  await expect(page).toHaveURL(/\/product\/[A-Z0-9]+/);
  await expect(loggedInPage.productPage.productPageTitle).toContainText(
    firstProduct.name,
  );

  await loggedInPage.productPage.addToCartButton.click();
  await expect(loggedInPage.productPage.header.cartCounter).toHaveText('1');

  await loggedInPage.productPage.header.clickCartItem();
  await expect(page).toHaveURL('/checkout');
  await expect(loggedInPage.checkoutPage.currentStepLabel).toHaveText('Cart');
  await expect(loggedInPage.checkoutPage.cart.productTitle).toContainText(
    firstProduct.name,
  );
  await expect(loggedInPage.checkoutPage.cart.productPrice).toContainText(
    '$' + `${firstProduct.price}`,
  );
  await expect(loggedInPage.checkoutPage.cart.rowTotalPrice).toContainText(
    '$' + `${firstProduct.price}`,
  );

  await loggedInPage.checkoutPage.cart.proceedToCheckoutButton.click();

  const expectedGreetingMessage =
    loggedInPage.checkoutPage.signIn.getExpectedGreeting(
      validCustomer.fullName,
    );

  await expect(loggedInPage.checkoutPage.signIn.greetingMessage).toHaveText(
    expectedGreetingMessage,
  );

  await loggedInPage.checkoutPage.signIn.proceedToCheckoutButton.click();
  await expect(loggedInPage.checkoutPage.currentStepLabel).toHaveText(
    'Billing Address',
  );

  await loggedInPage.checkoutPage.billingAddress.countrySelect.selectOption(
    validCustomer.country,
  );
  await loggedInPage.checkoutPage.billingAddress.postalCodeInput.fill(
    validCustomer.postalCode,
  );
  await loggedInPage.checkoutPage.billingAddress.houseNumberInput.fill(
    validCustomer.houseNumber,
  );

  await expect(
    loggedInPage.checkoutPage.billingAddress.countrySelect,
  ).toHaveValue(validCustomer.countryCode);
  await expect(
    loggedInPage.checkoutPage.billingAddress.postalCodeInput,
  ).toHaveValue(validCustomer.postalCode);
  await expect(
    loggedInPage.checkoutPage.billingAddress.houseNumberInput,
  ).toHaveValue(validCustomer.houseNumber);
  await expect(
    loggedInPage.checkoutPage.billingAddress.streetInput,
  ).toHaveValue(/^Test street \d+$/);
  await expect(loggedInPage.checkoutPage.billingAddress.cityInput).toHaveValue(
    /^[a-zA-Z]+$/,
  );
  await expect(loggedInPage.checkoutPage.billingAddress.stateInput).toHaveValue(
    /^[a-zA-Z]+$/,
  );

  await loggedInPage.checkoutPage.billingAddress.proceedToCheckoutButton.click();
  await expect(loggedInPage.checkoutPage.currentStepLabel).toHaveText(
    'Payment',
  );

  await loggedInPage.checkoutPage.payment.paymentMethodSelect.selectOption(
    validCustomer.paymentMethod,
  );
  await loggedInPage.checkoutPage.payment.creditCardNumberInput.fill(
    validCustomer.cardNumber,
  );
  await loggedInPage.checkoutPage.payment.cardHolderNameInput.fill(
    validCustomer.cardHolderName,
  );
  await loggedInPage.checkoutPage.payment.expirationDateInput.fill(
    validCustomer.expirationDate,
  );
  await loggedInPage.checkoutPage.payment.cvvInput.fill(validCustomer.cvv);

  await loggedInPage.checkoutPage.payment.confirmButton.click();
  await expect(
    loggedInPage.checkoutPage.payment.paymentSuccessMessageAlert,
  ).toHaveText('Payment was successful');
});
