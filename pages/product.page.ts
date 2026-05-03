import type { Locator, Page } from '@playwright/test';

export class ProductPage {
  page: Page;
  productPageTitle: Locator;
  productPrice: Locator;
  addToCartButton: Locator;
  addToFavoritesButton: Locator;
  compareButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productPageTitle = page.getByTestId('product-name');
    this.productPrice = page.getByTestId('unit-price');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.addToFavoritesButton = page.getByTestId('add-to-favorites');
    this.compareButton = page.getByTestId('add-to-compare');
  }
}
