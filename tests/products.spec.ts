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

const sortingCases = [
  { namePart: 'by name: Name A - Z', sortingOption: 'name', order: 'asc' },
  { namePart: 'by name: Name Z - A', sortingOption: 'name', order: 'desc' },
  {
    namePart: 'by price: Price (Low - High)',
    sortingOption: 'price',
    order: 'asc',
  },
  {
    namePart: 'by price: Price (High - Low)',
    sortingOption: 'price',
    order: 'desc',
  },
] as const;

sortingCases.forEach((testData) =>
  test(`Verify user can perform sorting ${testData.namePart}`, async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await homePage.navigate();
    await expect(homePage.sortingSelect).toBeVisible();

    await homePage.selectSortingOption(
      `${testData.sortingOption},${testData.order}`,
    );

    await expect
      .poll(
        async (): Promise<boolean> => {
          const items = await homePage.getProductData(testData.sortingOption);
          return homePage.validateSort(items, testData.order);
        },
        {
          message: `Sorting ${testData.namePart} failed`,
          timeout: 5000,
        },
      )
      .toBe(true);
  }),
);

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
        const names = await homePage.getProductData('name');
        return homePage.validateFiltering(names, PowerTools.SANDER);
      },
      {
        message: `Filtering by ${PowerTools.SANDER} failed`,
        timeout: 5000,
      },
    )
    .toBe(true);
});
