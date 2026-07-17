import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
});

function getAppleButton(page: Page) {
  return page.getByRole('button', { name: 'Apple (Fruit)', exact: true });
}

function getRegion(page: Page, name: string) {
  return page.getByRole('region', { name, exact: true });
}

test('moves a fruit to the Fruit column and returns to the bottom of the main list after 5 seconds', async ({
  page,
}) => {
  const apple = getAppleButton(page);
  await expect(apple).toHaveCount(1);

  await apple.click();
  await expect(
    getRegion(page, 'Fruit').getByRole('button', { name: 'Apple (Fruit)', exact: true })
  ).toBeVisible();
  await expect(
    getRegion(page, 'Main List').getByRole('button', { name: 'Apple (Fruit)', exact: true })
  ).toHaveCount(0);

  await page.clock.runFor(5000);

  await expect(
    getRegion(page, 'Main List').getByRole('button', { name: 'Apple (Fruit)', exact: true })
  ).toBeVisible();
  await expect(
    getRegion(page, 'Fruit').getByRole('button', { name: 'Apple (Fruit)', exact: true })
  ).toHaveCount(0);
});

test('returns a column item immediately when clicked and cancels the auto-return timer', async ({
  page,
}) => {
  await getAppleButton(page).click();
  await expect(
    getRegion(page, 'Fruit').getByRole('button', { name: 'Apple (Fruit)', exact: true })
  ).toBeVisible();

  await getRegion(page, 'Fruit')
    .getByRole('button', { name: 'Apple (Fruit)', exact: true })
    .click();
  await expect(
    getRegion(page, 'Main List').getByRole('button', { name: 'Apple (Fruit)', exact: true })
  ).toBeVisible();
  await expect(
    getRegion(page, 'Fruit').getByRole('button', { name: 'Apple (Fruit)', exact: true })
  ).toHaveCount(0);

  await page.clock.runFor(5000);

  // Should still only be a single Apple button (no duplicate from an orphan timer)
  await expect(getAppleButton(page)).toHaveCount(1);
});
