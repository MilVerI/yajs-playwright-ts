import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';
import { HeaderFragment } from './page_fragments/header.fragment.js';

export class LoginPage extends BasePage {
  protected readonly url = '/auth/login';
  public readonly header: HeaderFragment;
  public readonly loginForm: Locator;
  public readonly emailAddressIput: Locator;
  public readonly passwordInput: Locator;
  public readonly submitLoginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderFragment(page);
    this.loginForm = page.locator('app-login');
    this.emailAddressIput = this.loginForm.getByTestId('email');
    this.passwordInput = this.loginForm.getByTestId('password');
    this.submitLoginButton = this.loginForm.getByTestId('login-submit');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailAddressIput.fill(email);
    await this.passwordInput.fill(password);

    await this.submitLoginButton.click();
  }
}
