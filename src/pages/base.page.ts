import type { Page } from '@playwright/test';
import { PageConstructor } from './page.constructor.js';

export abstract class BasePage extends PageConstructor {
  protected abstract readonly url: string;

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates to the page's base URL with an optional suffix.
   *
   * @param suffix - An optional string to append to the base URL (e.g., a product ID or query parameter).
   * @example
   * // Navigates to the base URL (e.g., /products)
   * await productPage.navigate();
   *
   * // Navigates to a dynamic URL (e.g., /products/123)
   * await productPage.navigate('123');
   */
  public async navigate(suffix: string = '') {
    await this.page.goto(`${this.url}${suffix}`);
  }
}
