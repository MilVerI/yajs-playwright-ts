import { expect } from '@playwright/test';
import { test as setup } from '@fixtures/appPages.js';
import { validCustomer } from '../test_data/validCustomer.js';

import path from 'path';

const authFile = path.join(process.cwd(), 'playwright/.auth/user.json');

setup('authenticate', async ({ allPages, page }) => {
  // eslint-disable-next-line playwright/no-skipped-test
  setup.skip(
    !!process.env.CI,
    'Skipped on CI because of Cloudflare protection',
  );
  await allPages.loginPage.navigate();

  await expect(allPages.loginPage.loginForm).toBeVisible();

  await allPages.loginPage.login(validCustomer.email, validCustomer.password);

  await expect(page).toHaveURL('/account');
  await expect(allPages.accountPage.pageTitle).toContainText('my account', {
    ignoreCase: true,
  });

  await page.context().storageState({ path: authFile });
});
