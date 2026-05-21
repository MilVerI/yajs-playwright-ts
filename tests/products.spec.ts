import { expect } from '@playwright/test';
import { test } from '@fixtures/appPages.js';
import { PowerTools } from '@enums/product-categories.js';
import { validateSort, validateFiltering } from '@utils/assertions.js';

test('Verify user can view product details', async ({ allPages, page }) => {
  const productName = 'Combination Pliers';

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
  await expect(allPages.productPage.addToCartButton).toBeVisible();
  await expect(allPages.productPage.addToFavoritesButton).toBeVisible();
  await expect(allPages.productPage.compareButton).toBeVisible();
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
    allPages,
  }) => {
    // const allPages.homePage = new HomePage(page);

    await allPages.homePage.navigate();
    await expect(allPages.homePage.sortingSelect).toBeVisible();

    await allPages.homePage.selectSortingOption(
      `${testData.sortingOption},${testData.order}`,
    );

    await expect
      .poll(
        async (): Promise<boolean> => {
          const items = await allPages.homePage.getProductData(
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

test('Verify user can filter products by category', async ({ allPages }) => {
  await allPages.homePage.navigate();
  await expect(allPages.homePage.subcategoryCheckboxes.first()).toBeVisible();

  const subcategoryOption = allPages.homePage.getSubcategory(PowerTools.SANDER);

  await subcategoryOption.check();

  await expect
    .poll(
      async (): Promise<boolean> => {
        const names = await allPages.homePage.getProductData('name');
        return validateFiltering(names, PowerTools.SANDER);
      },
      {
        message: `Filtering by ${PowerTools.SANDER} failed`,
        timeout: 5000,
      },
    )
    .toBe(true);
});
