import { expect } from '@playwright/test';
import { test } from '@fixtures/appPages.js';
import { validCustomer } from '../test_data/validCustomer.js';

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
