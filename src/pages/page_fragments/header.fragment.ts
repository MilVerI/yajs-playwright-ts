import type { Locator, Page } from '@playwright/test';
import { PageConstructor } from '../page.constructor.js';

export class HeaderFragment extends PageConstructor {
  public readonly headerContainer: Locator;
  public readonly navigationBar: Locator;
  public readonly cartItem: Locator;
  public readonly cartCounter: Locator;

  constructor(page: Page) {
    super(page);
    this.headerContainer = page.locator('app-header');
    this.navigationBar = this.headerContainer.getByRole('navigation');
    this.cartItem = this.navigationBar.getByTestId('nav-cart');
    this.cartCounter = this.navigationBar.getByTestId('cart-quantity');
  }
  public async clickCartItem(): Promise<void> {
    await this.cartItem.click();
  }
}
