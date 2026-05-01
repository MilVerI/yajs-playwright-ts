// åimport { expect } from '@playwright/test';
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

  // I'm not sure if this is ok; see the question in login.spec.ts:26-30
  //
  //   async expectLoaded(): Promise<void> {
  //     await expect(this.page).toHaveURL('/account');
  //     await expect(this.pageTitle).toContainText('my account', {
  //       ignoreCase: true,
  //     });
  //   }
}
