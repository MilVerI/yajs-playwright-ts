// import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { PageConstructor } from '../page.constructor.js';

export class CartStep extends PageConstructor {
  public readonly cartTable: Locator;
  public readonly productRow: Locator;
  public readonly productTitle: Locator;
  public readonly productQuantity: Locator;
  public readonly productPrice: Locator;
  public readonly rowTotalPrice: Locator;
  public readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator('app-cart table');
    this.productRow = this.cartTable.locator(' tr.ng-star-inserted');
    this.productTitle = this.productRow.getByTestId('product-title');
    this.productQuantity = this.productRow.getByTestId('product-quantity');
    this.productPrice = this.productRow.getByTestId('product-price');
    this.rowTotalPrice = this.productRow.getByTestId('line-price');
    this.proceedToCheckoutButton = page.getByTestId('proceed-1');
  }

  getProductRow(productName: string): Locator {
    return this.productRow.filter({ hasText: productName });
  }

  getProductQuantity(productName: string): Locator {
    return this.getProductRow(productName).getByTestId('product-quantity');
  }

  getProductPrice(productName: string): Locator {
    return this.getProductRow(productName).getByTestId('product-price');
  }
}
