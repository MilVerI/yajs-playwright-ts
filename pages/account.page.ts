import type { Locator, Page } from '@playwright/test';

export class AccountPage {
  page: Page;
  navigationMenu: Locator;
  pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigationMenu = page.getByTestId('nav-menu');
    this.pageTitle = page.getByTestId('page-title');
  }

  async navigateToAccountPage(): Promise<void> {
    await this.page.goto('/account');
  }
}
