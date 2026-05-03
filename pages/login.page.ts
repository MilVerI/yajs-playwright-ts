import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  page: Page;
  loginForm: Locator;
  emailAddressIput: Locator;
  passwordInput: Locator;
  submitLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginForm = page.locator('app-login');
    this.emailAddressIput = this.loginForm.getByTestId('email');
    this.passwordInput = this.loginForm.getByTestId('password');
    this.submitLoginButton = this.loginForm.getByTestId('login-submit');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailAddressIput.fill(email);
    await this.passwordInput.fill(password);

    await this.submitLoginButton.click();
  }
}
