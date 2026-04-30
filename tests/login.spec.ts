import { test, expect } from '@playwright/test';
import { config } from 'dotenv';

config({ path: '.env.local' });

const VALID_CUSTOMER_EMAIL = process.env.VALID_CUSTOMER_EMAIL as string;
const VALID_CUSTOMER_PASSWORD = process.env.VALID_CUSTOMER_PASSWORD as string;

test('login with valid credentials', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/auth/login');

  const loginForm = page.locator('app-login');
  const emailAddress = page.locator('[data-test="email"]');
  const password = page.locator('[data-test="password"]');
  const submitLoginButton = page.locator('[data-test="login-submit"]');

  await expect(loginForm).toBeVisible();

  await emailAddress.fill(VALID_CUSTOMER_EMAIL);
  await password.fill(VALID_CUSTOMER_PASSWORD);

  await submitLoginButton.click();

  await expect(page).toHaveURL('https://practicesoftwaretesting.com/account');
  await expect(page.locator('[data-test="page-title"]')).toContainText(
    'my account',
    { ignoreCase: true },
  );
  await expect(page.locator('[data-test="nav-menu"]')).toHaveText('Jane Doe');
});
