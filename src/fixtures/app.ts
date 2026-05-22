import { test as base, expect } from '@playwright/test';
import { AllPages } from '@pages/allPages.js';
import { config } from 'dotenv';

type AppPages = {
  loggedInApp: AllPages;
  app: AllPages;
};

config({ path: '.env.local' });

const validCustomer = {
  email: process.env.VALID_CUSTOMER_EMAIL as string,
  password: process.env.VALID_CUSTOMER_PASSWORD as string,
  fullName: process.env.VALID_CUSTOMER_FULL_NAME as string,
};

export const test = base.extend<AppPages>({
  app: async ({ page }, use) => {
    const app = new AllPages(page);

    await use(app);
  },

  loggedInApp: async ({ app, page }, use) => {
    await app.loginPage.navigate();
    await expect(app.loginPage.loginForm).toBeVisible();
    await app.loginPage.login(validCustomer.email, validCustomer.password);
    await expect(page).toHaveURL('/account');

    await expect(app.accountPage.navigationMenu).toHaveText(
      validCustomer.fullName,
    );

    await use(app);
  },
});
