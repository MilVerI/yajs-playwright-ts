import type { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';
import { HeaderFragment } from '@pages/page_fragments/header.fragment.js';

export class HomePage extends BasePage {
  protected readonly url = '/';
  public readonly header: HeaderFragment;
  public readonly productsContainer: Locator;
  public readonly productCardsList: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderFragment(page);
    this.productsContainer = page.locator('div[data-test].container');
    this.productCardsList = page.locator('a[data-test^="product-"]');
  }

  getProductCard(productName: string): Locator {
    return this.productCardsList.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
  }

  async getProductPriceValue(productName: string): Promise<string> {
    const productPrice =
      this.getProductCard(productName).getByTestId('product-price');
    const text = await productPrice.textContent();
    if (!text) throw new Error(`Price not found for: ${productName}`);
    return text.replace('$', '');
  }

  async clickProductCard(productName: string) {
    await this.getProductCard(productName).click();
  }
}
