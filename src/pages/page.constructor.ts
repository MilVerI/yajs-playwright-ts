import type { Page } from '@playwright/test';

export abstract class PageConstructor {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
