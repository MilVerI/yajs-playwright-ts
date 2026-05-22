// import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { PageConstructor } from '../page.constructor.js';

export class SignInStep extends PageConstructor {
  public readonly signInContainer: Locator;
  public readonly greetingMessage: Locator;
  public readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.signInContainer = page.locator('app-login');
    this.greetingMessage = this.signInContainer.locator('p.ng-star-inserted');
    this.proceedToCheckoutButton = page.getByTestId('proceed-2');
  }

  getExpectedGreeting(userName: string): string {
    return `Hello ${userName}, you are already logged in. You can proceed to checkout.`;
  }
}
