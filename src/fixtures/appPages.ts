import { test as base, expect } from '@playwright/test';
import { AllPages } from '@pages/allPages.js';
import { config } from 'dotenv';

type AppPages = {
  loggedInPage: AllPages;
  allPages: AllPages;
};

config({ path: '.env.local' });

const validCustomer = {
  email: process.env.VALID_CUSTOMER_EMAIL as string,
  password: process.env.VALID_CUSTOMER_PASSWORD as string,
  fullName: process.env.VALID_CUSTOMER_FULL_NAME as string,
};

export const test = base.extend<AppPages>({
  allPages: async ({ page }, use) => {
    const allPages = new AllPages(page);

    await use(allPages);
  },

  loggedInPage: async ({ allPages, page }, use) => {
    await allPages.loginPage.navigate();
    await expect(allPages.loginPage.loginForm).toBeVisible();
    await allPages.loginPage.login(validCustomer.email, validCustomer.password);
    await expect(page).toHaveURL('/account');

    await expect(allPages.accountPage.navigationMenu).toHaveText(
      validCustomer.fullName,
    );

    await use(allPages);
  },
});
