import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('/api/users/grouped', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        Engineering: {
          male: 1,
          female: 0,
          ageRange: '50-50',
          hair: { Black: 1 },
          addressUser: { TerryMedhurst: '10001' },
          addressCities: { TerryMedhurst: 'New York' },
        },
        Sales: {
          male: 0,
          female: 1,
          ageRange: '30-30',
          hair: { Blond: 1 },
          addressUser: { JaneDoe: '20002' },
          addressCities: { JaneDoe: 'Chicago' },
        },
      }),
    });
  });
});

test('displays department summaries fetched from the API', async ({ page }) => {
  await page.goto('/departments');

  await expect(page.getByRole('heading', { name: 'Department Summary' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Engineering' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sales' })).toBeVisible();

  const engineering = page.getByRole('region', { name: 'Engineering' });
  await expect(engineering).toContainText('1');
  await expect(engineering).toContainText('0');
  await expect(engineering).toContainText('50-50');
  await expect(engineering).toContainText('Black');
  await expect(engineering).toContainText('TerryMedhurst');
  await expect(engineering).toContainText('New York');

  const sales = page.getByRole('region', { name: 'Sales' });
  await expect(sales).toContainText('0');
  await expect(sales).toContainText('1');
  await expect(sales).toContainText('30-30');
  await expect(sales).toContainText('Blond');
  await expect(sales).toContainText('JaneDoe');
  await expect(sales).toContainText('Chicago');
});

test('navigates between Fresh Sort and Departments', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'View Departments' }).click();
  await expect(page).toHaveURL('/departments');

  await page.getByRole('link', { name: 'Back to Fresh Sort' }).click();
  await expect(page).toHaveURL('/');
});
