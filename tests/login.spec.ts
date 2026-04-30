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
  await page.goto('https://practicesoftwaretesting.com/auth/login');

  // To convert to a page object in the future
  const loginPage: LoginPage = {
    loginForm: page.locator('app-login'),
    emailAddress: page.locator('[data-test="email"]'),
    password: page.locator('[data-test="password"]'),
    submitLoginButton: page.locator('[data-test="login-submit"]'),
  };
  // To convert to a page object in the future
  const accountPage = {
    navigationMenu: page.locator('[data-test="nav-menu"]'),
    pageTitle: page.locator('[data-test="page-title"]'),
  };

  await expect(loginPage.loginForm).toBeVisible();

  await loginPage.emailAddress.fill(validCustomerEmail);
  await loginPage.password.fill(validCustomerPassword);

  await loginPage.submitLoginButton.click();

  await expect(page).toHaveURL('https://practicesoftwaretesting.com/account');
  await expect(accountPage.pageTitle).toContainText('my account', {
    ignoreCase: true,
  });
  await expect(accountPage.navigationMenu).toHaveText('Jane Doe');
});
