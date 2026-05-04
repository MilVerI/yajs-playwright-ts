import type { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base.page.js';
import { HeaderFragment } from '@pages/page_fragments/header.fragment.js';

export class ProductPage extends BasePage {
  protected readonly url = '/product/';
  public readonly header: HeaderFragment;
  public readonly productPageTitle: Locator;
  public readonly productPrice: Locator;
  public readonly addToCartButton: Locator;
  public readonly addToFavoritesButton: Locator;
  public readonly compareButton: Locator;
  public readonly addToCartAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderFragment(page);
    this.productPageTitle = page.getByTestId('product-name');
    this.productPrice = page.getByTestId('unit-price');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.addToFavoritesButton = page.getByTestId('add-to-favorites');
    this.compareButton = page.getByTestId('add-to-compare');
    this.addToCartAlert = page
      .getByRole('alert')
      .filter({ hasText: 'Product added to shopping cart' });
  }
}
