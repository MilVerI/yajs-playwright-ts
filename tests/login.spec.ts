import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
import { LoginPage } from '@pages/login.page.js';
import { AccountPage } from '@pages/account.page.js';

config({ path: '.env.local' });

//  move this to the fixture later if there are too many users as part of 'users'
const validCustomer = {
  email: process.env.VALID_CUSTOMER_EMAIL as string,
  password: process.env.VALID_CUSTOMER_PASSWORD as string,
  fullName: process.env.VALID_CUSTOMER_FULL_NAME as string,
};

test('Verify login with valid credentials', async ({ page }) => {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(!!process.env.CI, 'Skipped on CI because of Cloudflare protection');

  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);

  await loginPage.navigate();

  await expect(loginPage.loginForm).toBeVisible();

  await loginPage.login(validCustomer.email, validCustomer.password);

  await expect(page).toHaveURL('/account');
  await expect(accountPage.pageTitle).toContainText('my account', {
    ignoreCase: true,
  });

  await expect(accountPage.navigationMenu).toHaveText(validCustomer.fullName);
});
