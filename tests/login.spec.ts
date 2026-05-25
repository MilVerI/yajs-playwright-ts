import { expect } from '@playwright/test';
import { test } from '@fixtures/app.js';
import { validCustomer } from '../test_data/validCustomer.js';

interface LoginResponse {
  access_token: string;
}

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

  await expect(app.accountPage.userFullNameButton).toHaveText(
    validCustomer.fullName,
    { ignoreCase: true },
  );
});

test('Verify login via API', async ({ page, app, request }) => {
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
});
