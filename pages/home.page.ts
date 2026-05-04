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
