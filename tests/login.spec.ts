import { expect } from '@playwright/test';
import { test } from '@fixtures/app.js';
import { validCustomer } from '../test_data/validCustomer.js';

test('Verify login with valid credentials', async ({ app, page }) => {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(!!process.env.CI, 'Skipped on CI because of Cloudflare protection');

  await app.loginPage.navigate();

  await expect(app.loginPage.loginForm).toBeVisible();

  await app.loginPage.login(validCustomer.email, validCustomer.password);

  await expect(page).toHaveURL('/account');
  await expect(app.accountPage.pageTitle).toContainText('my account', {
    ignoreCase: true,
  });

  await expect(app.accountPage.navigationMenu).toHaveText(
    validCustomer.fullName,
  );
});
