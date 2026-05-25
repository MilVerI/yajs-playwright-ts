import { test as base, expect } from '@playwright/test';
import { AllPages } from '@pages/allPages.js';
import { config } from 'dotenv';

type AppPages = {
  loggedInApp: AllPages;
  app: AllPages;
};

interface LoginResponse {
  access_token: string;
}

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

  loggedInApp: async ({ page, app, request }, use) => {
    const apiResponse = await request.post(
      'https://api.practicesoftwaretesting.com/users/login',
      {
        data: {
          email: validCustomer.email,
          password: validCustomer.password,
        },
      },
    );

    const jsonResponse = (await apiResponse.json()) as LoginResponse;
    const authToken = jsonResponse.access_token;

    await page.goto('/');
    await page.evaluate((token) => {
      localStorage.setItem('auth-token', token);
    }, authToken);
    await page.reload();

    await expect(app.accountPage.userFullNameButton).toHaveText(
      validCustomer.fullName,
      { ignoreCase: true, timeout: 5000 },
    );

    await use(app);
  },
});
