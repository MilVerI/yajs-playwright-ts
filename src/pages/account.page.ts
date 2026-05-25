import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';
import { HeaderFragment } from './page_fragments/header.fragment.js';

export class AccountPage extends BasePage {
  protected readonly url = '/account';
  public readonly header: HeaderFragment;
  public readonly navigationMenu: Locator;
  public readonly pageTitle: Locator;
  public readonly userFullNameButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderFragment(page);
    this.pageTitle = page.getByTestId('page-title');
    this.navigationMenu = page.locator('div[id=navbarSupportedContent]');
    this.userFullNameButton = this.navigationMenu.getByTestId('nav-menu');
  }
}
