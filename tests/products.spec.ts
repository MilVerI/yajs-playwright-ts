import { test, expect } from '@playwright/test';
import { ProductPage } from '@pages/product.page.js';
import { HomePage } from '@pages/home.page.js';
import { CheckoutPage } from '@pages/checkout/checkout.page.js';
import { PowerTools } from '@enums/product-categories.js';

test('Verify user can view product details', async ({ page }) => {
  const productPage = new ProductPage(page);
  const homePage = new HomePage(page);

  const productName = 'Combination Pliers';

  await homePage.navigate();
  await expect(homePage.productNames.first()).toBeVisible();

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
  const checkoutPage = new CheckoutPage(page);
  const productName = 'Slip Joint Pliers';

  await test.step('Navigate to product page', async () => {
    await homePage.navigate();
    await expect(homePage.productNames.first()).toBeVisible();

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
    await expect(checkoutPage.cart.productTitle).toHaveText(productName);
    await expect(checkoutPage.cart.productQuantity).toHaveValue('1');
    await expect(checkoutPage.cart.proceedToCheckoutButton).toBeVisible();
  });
});

// expect.poll — helps prevent fakiless caused by user UI updates

test.describe('Sorting by product name', () => {
  test('Verify user can perform sorting by name: Name A - Z', async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();
    await expect(homePage.sortingSelect).toBeVisible();

    await homePage.selectSortingOption('name,asc');

    await expect
      .poll(
        async (): Promise<boolean> => {
          const names = await homePage.getProductNames();
          return homePage.validateSort(names, 'asc');
        },
        {
          message: 'Sorting Name A-Z failed',
          timeout: 5000,
        },
      )
      .toBe(true);
  });

  test('Verify user can perform sorting by name: Name Z - A', async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();
    await expect(homePage.sortingSelect).toBeVisible();

    await homePage.selectSortingOption('name,desc');

    await expect
      .poll(
        async (): Promise<boolean> => {
          const names = await homePage.getProductNames();
          return homePage.validateSort(names, 'desc');
        },
        {
          message: 'Sorting Name Z - A failed',
          timeout: 5000,
        },
      )
      .toBe(true);
  });
});

test.describe('Sorting by product price', () => {
  test('Verify user can perform sorting by price: Price (Low - High)', async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();
    await expect(homePage.sortingSelect).toBeVisible();

    await homePage.selectSortingOption('price,asc');

    await expect
      .poll(
        async (): Promise<boolean> => {
          const prices = await homePage.getProductPrices();
          return homePage.validateSort(prices, 'asc');
        },
        {
          message: 'Sorting Price (Low - High) failed',
          timeout: 5000,
        },
      )
      .toBe(true);
  });
});

test('Verify user can perform sorting by price: Price (High - Low)', async ({
  page,
}) => {
  const homePage = new HomePage(page);

  await homePage.navigate();
  await expect(homePage.sortingSelect).toBeVisible();

  await homePage.selectSortingOption('price,desc');

  await expect
    .poll(
      async (): Promise<boolean> => {
        const prices = await homePage.getProductPrices();
        return homePage.validateSort(prices, 'desc');
      },
      {
        message: 'Sorting (High - Low) failed',
        timeout: 5000,
      },
    )
    .toBe(true);
});

// Products on the Homepage do not have a clear visual or verifiable indicator of their category

test('Verify user can filter products by category', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.navigate();
  await expect(homePage.subcategoryCheckboxes.first()).toBeVisible();

  const subcategoryOption = homePage.getSubcategory(PowerTools.SANDER);

  await subcategoryOption.check();

  await expect
    .poll(
      async (): Promise<boolean> => {
        const names = await homePage.getProductNames();
        return homePage.validateFiltering(names, PowerTools.SANDER);
      },
      {
        message: `Filtering by ${PowerTools.SANDER} failed`,
        timeout: 5000,
      },
    )
    .toBe(true);
});
