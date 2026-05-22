import { expect } from '@playwright/test';
import { test } from '@fixtures/app.js';
import { PowerTools } from '@enums/productCategories.js';
import { validateSort, validateFiltering } from '@utils/assertions.js';

test('Verify user can view product details', async ({ app, page }) => {
  const productName = 'Combination Pliers';

  await app.homePage.navigate();
  await expect(app.homePage.productNames.first()).toBeVisible();

  const productPriceValue =
    await app.homePage.getProductPriceValue(productName);
  await app.homePage.clickProductCard(productName);

  await expect(page).toHaveURL(/\/product\/[A-Z0-9]+/);
  await expect(app.productPage.productPageTitle).toContainText(productName);
  await expect(app.productPage.productPrice).toContainText(productPriceValue);
  await expect(app.productPage.addToCartButton).toBeVisible();
  await expect(app.productPage.addToFavoritesButton).toBeVisible();
  await expect(app.productPage.compareButton).toBeVisible();
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
    app,
  }) => {
    // const app.homePage = new HomePage(page);

    await app.homePage.navigate();
    await expect(app.homePage.sortingSelect).toBeVisible();

    await app.homePage.selectSortingOption(
      `${testData.sortingOption},${testData.order}`,
    );

    await expect
      .poll(
        async (): Promise<boolean> => {
          const items = await app.homePage.getProductData(
            testData.sortingOption,
          );
          return validateSort(items, testData.order);
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

test('Verify user can filter products by category', async ({ app }) => {
  await app.homePage.navigate();
  await expect(app.homePage.subcategoryCheckboxes.first()).toBeVisible();

  const subcategoryOption = app.homePage.getSubcategory(PowerTools.SANDER);

  await subcategoryOption.check();

  await expect
    .poll(
      async (): Promise<boolean> => {
        const names = await app.homePage.getProductData('name');
        return validateFiltering(names, PowerTools.SANDER);
      },
      {
        message: `Filtering by ${PowerTools.SANDER} failed`,
        timeout: 5000,
      },
    )
    .toBe(true);
});
