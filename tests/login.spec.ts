import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
import type { Locator } from '@playwright/test';

config({ path: '.env.local' });

const validCustomerEmail = process.env.VALID_CUSTOMER_EMAIL as string;
const validCustomerPassword = process.env.VALID_CUSTOMER_PASSWORD as string;

interface LoginPage {
  loginForm: Locator;
  emailAddress: Locator;
  password: Locator;
  submitLoginButton: Locator;
}

test('Login with valid credentials', async ({ page }) => {
  test.skip(!!process.env.CI, 'Skipped on CI because of Cloudflare protection');

  await page.goto('/auth/login');

  // To convert to a page object in the future
  const loginPage: LoginPage = {
    loginForm: page.locator('app-login'),
    emailAddress: page.getByTestId('email'),
    password: page.getByTestId('password'),
    submitLoginButton: page.getByTestId('login-submit'),
  };
  // To convert to a page object in the future
  const accountPage = {
    navigationMenu: page.getByTestId('nav-menu'),
    pageTitle: page.getByTestId('page-title'),
  };

  await expect(loginPage.loginForm).toBeVisible();

  await loginPage.emailAddress.fill(validCustomerEmail);
  await loginPage.password.fill(validCustomerPassword);

  await loginPage.submitLoginButton.click();

  await expect(page).toHaveURL('/account');
  await expect(accountPage.pageTitle).toContainText('my account', {
    ignoreCase: true,
  });
  await expect(accountPage.navigationMenu).toHaveText('Jane Doe');
});
