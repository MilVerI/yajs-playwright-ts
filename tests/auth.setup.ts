import { expect } from '@playwright/test';
import { test as setup } from '@fixtures/app.js';
import { validCustomer } from '../test_data/validCustomer.js';

import path from 'path';

const authFile = path.join(process.cwd(), 'playwright/.auth/user.json');

setup('authenticate', async ({ app, page }) => {
  // eslint-disable-next-line playwright/no-skipped-test
  setup.skip(
    !!process.env.CI,
    'Skipped on CI because of Cloudflare protection',
  );
  await app.loginPage.navigate();

  await expect(app.loginPage.loginForm).toBeVisible();

  await app.loginPage.login(validCustomer.email, validCustomer.password);

  await expect(page).toHaveURL('/account');
  await expect(app.accountPage.pageTitle).toContainText('my account', {
    ignoreCase: true,
  });

  await page.context().storageState({ path: authFile });
});
