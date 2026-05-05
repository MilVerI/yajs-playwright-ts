import type { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';
import { HeaderFragment } from '@pages/page_fragments/header.fragment.js';

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
    if (!text) throw new Error(`Price not found for: ${productName}`);
    return text.replace('$', '');
  }

  async getProductNames(): Promise<string[]> {
    return (await this.productNames.allTextContents()).map((s) => s.trim());
  }

  async getProductPrices(): Promise<number[]> {
    return (await this.productPrices.allTextContents()).map((s) =>
      parseFloat(s.replace('$', '')),
    );
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
