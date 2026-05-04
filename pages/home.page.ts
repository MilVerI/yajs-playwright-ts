import type { Locator, Page } from '@playwright/test';

export class HomePage {
  page: Page;
  productsContainer: Locator;
  productCardsList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsContainer = page.locator('div[data-test].container');
    this.productCardsList = page.locator('a[data-test^="product-"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  getProductCard(productNameVale: string): Locator {
    return this.productCardsList.filter({
      has: this.page.getByText(productNameVale, { exact: true }),
    });
  }

  async getproductPriceValue(productCard: Locator): Promise<string> {
    const productPrice = productCard.getByTestId('product-price');
    return ((await productPrice.textContent()) ?? '0').replace('$', '');
  }
}
