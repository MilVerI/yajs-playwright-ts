import { expect } from '@playwright/test';
import { test } from '@fixtures/appPages.js';
import { config } from 'dotenv';

config({ path: '.env.local' });

//  move this to the fixture later if there are too many users as part of 'users'
const validCustomer = {
  email: process.env.VALID_CUSTOMER_EMAIL as string,
  password: process.env.VALID_CUSTOMER_PASSWORD as string,
  fullName: process.env.VALID_CUSTOMER_FULL_NAME as string,
};

test('Verify login with valid credentials', async ({ allPages, page }) => {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(!!process.env.CI, 'Skipped on CI because of Cloudflare protection');

  await allPages.loginPage.navigate();

  await expect(allPages.loginPage.loginForm).toBeVisible();

  await allPages.loginPage.login(validCustomer.email, validCustomer.password);

  await expect(page).toHaveURL('/account');
  await expect(allPages.accountPage.pageTitle).toContainText('my account', {
    ignoreCase: true,
  });

  await expect(allPages.accountPage.navigationMenu).toHaveText(
    validCustomer.fullName,
  );
});
