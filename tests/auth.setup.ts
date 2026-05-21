import { expect } from '@playwright/test';
import { test as setup } from '@fixtures/appPages.js';
import { config } from 'dotenv';

import path from 'path';

config({ path: '.env.local' });

//  TODO: move the user picking logic to the fixture to pass the 'user' in the setup()
const validCustomer = {
  email: process.env.VALID_CUSTOMER_EMAIL as string,
  password: process.env.VALID_CUSTOMER_PASSWORD as string,
  fullName: process.env.VALID_CUSTOMER_FULL_NAME as string,
};

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
