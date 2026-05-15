import type { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';
import { HeaderFragment } from '@pages/page_fragments/header.fragment.js';

type ProductDataTypeMap = {
  name: string;
  price: number;
};

export class HomePage extends BasePage {
  protected readonly url = '/';
  public readonly header: HeaderFragment;
  public readonly productCardsList: Locator;
  public readonly productNames: Locator;
  public readonly productPrices: Locator;
  public readonly sortingSelect: Locator;
  public readonly categoryCheckboxes: Locator;
  public readonly subcategoryCheckboxes: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderFragment(page);
    this.productCardsList = page.locator('a[data-test^="product-"]');
    this.productNames = this.productCardsList.getByTestId('product-name');
    this.productPrices = this.productCardsList.getByTestId('product-price');
    this.sortingSelect = page.getByTestId('sort');
    this.categoryCheckboxes = page.locator('.checkbox:has(ul) > label');
    this.subcategoryCheckboxes = page.locator('ul .checkbox label');
  }

  getProductCard(productName: string): Locator {
    return this.productCardsList.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
  }

  async clickProductCard(productName: string): Promise<void> {
    await this.getProductCard(productName).click();
  }

  async getProductPriceValue(productName: string): Promise<string> {
    const productPrice =
      this.getProductCard(productName).getByTestId('product-price');
    const text = await productPrice.textContent();

    return text ? text.replace('$', '') : '';
  }

  /**
   * Retrieves and processes an array of product data from the UI (names, prices, etc.).
   *
   * @template K - A key from the {@link ProductDataTypeMap} type map that defines the type of the returned data.
   * @param {K} type - The data category to retrieve (`‘names’` or `‘prices’`).
   * @returns {Promise<ProductDataTypeMap[K][]>} An array of strings for `‘names’` or an array of numbers for `‘prices’`.
   *
   * @example
   * // Returns string[]
   * const names = await homePage.getProductData(‘names’);
   *
   * @example
   * // Returns number[]
   * const prices = await homePage.getProductData(‘prices’);
   */
  async getProductData<K extends keyof ProductDataTypeMap>(
    type: K,
  ): Promise<ProductDataTypeMap[K][]> {
    switch (type) {
      case 'name': {
        const contents = await this.productNames.allTextContents();
        return contents.map((s) => s.trim()) as ProductDataTypeMap[K][];
      }
      case 'price': {
        const contents = await this.productPrices.allTextContents();
        return contents.map((s) =>
          parseFloat(s.replace('$', '')),
        ) as ProductDataTypeMap[K][];
      }
      default: {
        const exhaustiveCheck: never = type;
        return exhaustiveCheck;
      }
    }
  }

  async selectSortingOption(option: string): Promise<void> {
    await this.sortingSelect.selectOption({ value: option });
  }
  getCategory(name: string): Locator {
    return this.categoryCheckboxes.filter({ hasText: name }).locator('input');
  }

  getSubcategory(name: string): Locator {
    return this.subcategoryCheckboxes
      .filter({ hasText: name })
      .locator('input');
  }
}
