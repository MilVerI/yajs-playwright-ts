import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/product.page.js';
import { HomePage } from '../pages/home.page.js';

test('Verify user can view product details', async ({ page }) => {
  const productPage = new ProductPage(page);
  const homePage = new HomePage(page);

  // I was thinking about extracting the mapping between the product name and its ID
  // (which is used as part of the `data-testid` attribute and in the URL).
  // This would allow us to create more precise locators and run tests on a random product from the list.
  // However, it’s unclear how well this approach would work in a real-world project.
  const productName = 'Combination Pliers';

  await homePage.navigateToHomePage();
  await expect(homePage.productsContainer).toBeVisible();

  const productCard = homePage.getProductCard(productName);
  const productPriceValue = await homePage.getproductPriceValue(productCard);

  await productCard.click();

  await expect(page).toHaveURL(/\/product\/[A-Z0-9]+/);
  await expect(productPage.productPageTitle).toContainText(productName);
  await expect(productPage.productPrice).toContainText(productPriceValue);
  await expect(productPage.addToCartButton).toBeVisible();
  await expect(productPage.addToFavoritesButton).toBeVisible();
  await expect(productPage.compareButton).toBeVisible();
});
