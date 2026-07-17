import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
});

function getRegion(page: Page, name: string) {
  return page.getByRole('region', { name, exact: true });
}

function getProduceButton(page: Page, name: string, type: string) {
  return page.getByRole('button', { name: `${name} (${type})`, exact: true });
}

test('moves a fruit to the Fruit column and returns to the bottom of the main list after 5 seconds', async ({
  page,
}) => {
  const apple = getProduceButton(page, 'Apple', 'Fruit');
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

test('moves a vegetable to the Vegetable column and returns after 5 seconds', async ({ page }) => {
  const broccoli = getProduceButton(page, 'Broccoli', 'Vegetable');

  await broccoli.click();

  await expect(
    getRegion(page, 'Vegetable').getByRole('button', { name: 'Broccoli (Vegetable)', exact: true })
  ).toBeVisible();
  await expect(
    getRegion(page, 'Main List').getByRole('button', { name: 'Broccoli (Vegetable)', exact: true })
  ).toHaveCount(0);

  await page.clock.runFor(5000);

  await expect(
    getRegion(page, 'Main List').getByRole('button', { name: 'Broccoli (Vegetable)', exact: true })
  ).toBeVisible();
  await expect(
    getRegion(page, 'Vegetable').getByRole('button', { name: 'Broccoli (Vegetable)', exact: true })
  ).toHaveCount(0);
});

test('returns a column item immediately when clicked and cancels the auto-return timer', async ({
  page,
}) => {
  const apple = getProduceButton(page, 'Apple', 'Fruit');

  await apple.click();
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

  // No duplicate from an orphan timer
  await expect(apple).toHaveCount(1);
});

test('sorts multiple items into their correct baskets at the same time', async ({ page }) => {
  await getProduceButton(page, 'Apple', 'Fruit').click();
  await getProduceButton(page, 'Broccoli', 'Vegetable').click();

  await expect(
    getRegion(page, 'Fruit').getByRole('button', { name: 'Apple (Fruit)', exact: true })
  ).toBeVisible();
  await expect(
    getRegion(page, 'Vegetable').getByRole('button', { name: 'Broccoli (Vegetable)', exact: true })
  ).toBeVisible();

  const mainList = getRegion(page, 'Main List');
  await expect(mainList.getByRole('button', { name: 'Apple (Fruit)', exact: true })).toHaveCount(0);
  await expect(
    mainList.getByRole('button', { name: 'Broccoli (Vegetable)', exact: true })
  ).toHaveCount(0);
});

test('shows empty-state messages in baskets when no produce has been sorted there', async ({
  page,
}) => {
  await expect(getRegion(page, 'Fruit')).toContainText('Basket empty');
  await expect(getRegion(page, 'Vegetable')).toContainText('Basket empty');
});
