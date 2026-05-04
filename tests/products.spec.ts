import { test, expect } from '@playwright/test';
import { ProductPage } from '@pages/product.page.js';
import { HomePage } from '@pages/home.page.js';
import { CheckoutPage } from '@pages/checkout/checkout.page.js';

test('Verify user can view product details', async ({ page }) => {
  const productPage = new ProductPage(page);
  const homePage = new HomePage(page);

  const productName = 'Combination Pliers';

  await homePage.navigate();
  await expect(homePage.productsContainer).toBeVisible();

  const productPriceValue = await homePage.getProductPriceValue(productName);
  await homePage.clickProductCard(productName);

  await expect(page).toHaveURL(/\/product\/[A-Z0-9]+/);
  await expect(productPage.productPageTitle).toContainText(productName);
  await expect(productPage.productPrice).toContainText(productPriceValue);
  await expect(productPage.addToCartButton).toBeVisible();
  await expect(productPage.addToFavoritesButton).toBeVisible();
  await expect(productPage.compareButton).toBeVisible();
});

test('Verify user can add product to cart', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const checkout = new CheckoutPage(page);
  const productName = 'Slip Joint Pliers';

  await test.step('Navigate to product page', async () => {
    await homePage.navigate();
    await expect(homePage.productsContainer).toBeVisible();

    const productPriceValue = await homePage.getProductPriceValue(productName);
    await homePage.clickProductCard(productName);

    await expect(page).toHaveURL(/\/product\/[A-Z0-9]+/);
    await expect(productPage.productPageTitle).toContainText(productName);
    await expect(productPage.productPrice).toContainText(productPriceValue);
  });

  await test.step('Add product to cart', async () => {
    await productPage.addToCartButton.click();
    await expect(productPage.addToCartAlert).toBeVisible();
    await expect(productPage.addToCartAlert).toBeHidden({ timeout: 8000 });
    await expect(productPage.header.cartCounter).toHaveText('1');
  });

  await test.step('Verify cart', async () => {
    await productPage.header.clickCartItem();

    await expect(page).toHaveURL('/checkout');
    await expect(checkout.cart.productTitle).toHaveText(productName);
    await expect(checkout.cart.productQuantity).toHaveValue('1');
    await expect(checkout.cart.proceedToCheckoutButton).toBeVisible();
  });
});

// test.describe('Sorting by product name', () => {
//   test('Verify user can perform sorting by name: asc', async ({ page }) => {
//     const productPage = new ProductPage(page);
//   });

//   test('Verify user can perform sorting by name: desc', async ({ page }) => {
//     const productPage = new ProductPage(page);
//   });
// });

// test.describe('Sorting by product price', () => {
//   test('Verify user can perform sorting by price: asc', async ({ page }) => {
//     const productPage = new ProductPage(page);
//   });

//   test('Verify user can perform sorting by price: desc', async ({ page }) => {
//     const productPage = new ProductPage(page);
//   });
// });

// test('Verify user can filter products by category', async ({ page }) => {});
