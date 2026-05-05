import type { Page } from '@playwright/test';
import { PageConstructor } from '@pages/page.constructor.js';

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

  /**
   * A general-purpose method for checking sorting
   * @param array - an array of data from the page
   * @param order - ‘asc’ (ascending) or ‘desc’ (descending)
   */
  validateSort(array: (string | number)[], order: 'asc' | 'desc'): boolean {
    if (array.length === 0) return false;

    const actualJson = JSON.stringify(array);

    const isNumeric = typeof array[0] === 'number';

    const expectedSorted = [...array].sort((a, b) => {
      if (isNumeric) {
        return order === 'asc'
          ? (a as number) - (b as number)
          : (b as number) - (a as number);
      } else {
        const res = String(a).localeCompare(String(b));
        return order === 'asc' ? res : -res;
      }
    });

    const expectedJson = JSON.stringify(expectedSorted);

    return actualJson === expectedJson;
  }

  /**
   * A general-purpose method for checking filtering for string values. Can be modified later to fit more criterias.
   * @param array - an array of data from the page
   * @param criteria - string to check is an array elements sutisfy filtering
   */
  validateFiltering(array: string[], criteria: string): boolean {
    if (array.length === 0) return false;
    else {
      return array.every((s) =>
        s.toLowerCase().includes(criteria.toLowerCase()),
      );
    }
  }
}
