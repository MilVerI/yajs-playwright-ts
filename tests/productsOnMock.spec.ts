import { expect } from '@playwright/test';
import { test } from '@fixtures/app.js';
import mockProducts from '../test_data/mocks/products.json' with { type: 'json' };

test('Verify user can view 20 products per page on mock data from file', async ({
  app,
  page,
}) => {
  await page.route(
    'https://api.practicesoftwaretesting.com/products*',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockProducts,
      });
    },
  );

  await app.homePage.navigate();
  await expect(app.homePage.productNames).toHaveCount(20);
});
