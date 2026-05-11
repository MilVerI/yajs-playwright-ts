import { test as setup, expect } from '@playwright/test';
import { config } from 'dotenv';
import { LoginPage } from '@pages/login.page.js';
import { AccountPage } from '@pages/account.page.js';
import path from 'path';

config({ path: '.env.local' });

//  TODO: move the user picking logic to the fixture to pass the 'user' in the setup()
const validCustomer = {
  email: process.env.VALID_CUSTOMER_EMAIL as string,
  password: process.env.VALID_CUSTOMER_PASSWORD as string,
  fullName: process.env.VALID_CUSTOMER_FULL_NAME as string,
};

const authFile = path.join(process.cwd(), 'playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // eslint-disable-next-line playwright/no-skipped-test
  setup.skip(
    !!process.env.CI,
    'Skipped on CI because of Cloudflare protection',
  );
  // but how we'll run tests that need an auth?)))))

  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);

  await loginPage.navigate();
  await expect(loginPage.loginForm).toBeVisible();
  await loginPage.login(validCustomer.email, validCustomer.password);
  await expect(page).toHaveURL('/account');

  await expect(accountPage.navigationMenu).toHaveText(validCustomer.fullName);

  await page.context().storageState({ path: authFile });
});
