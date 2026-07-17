import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
});

function getAppleButton(page: Page) {
  return page.getByRole('button', { name: 'Apple (Fruit)', exact: true });
}

test('moves a fruit to the Fruit column and returns to the bottom of the main list after 5 seconds', async ({
  page,
}) => {
  const apple = getAppleButton(page);
  await expect(apple).toHaveCount(1);

  await apple.click();
  await expect(
    page.locator('section:has-text("Fruit") [aria-label="Apple (Fruit)"]')
  ).toBeVisible();
  await expect(
    page.locator('section:has-text("Main List") [aria-label="Apple (Fruit)"]')
  ).toHaveCount(0);

  await page.clock.runFor(5000);

  await expect(
    page.locator('section:has-text("Main List") [aria-label="Apple (Fruit)"]')
  ).toBeVisible();
  await expect(page.locator('section:has-text("Fruit") [aria-label="Apple (Fruit)"]')).toHaveCount(
    0
  );
});

test('returns a column item immediately when clicked and cancels the auto-return timer', async ({
  page,
}) => {
  await getAppleButton(page).click();
  await expect(
    page.locator('section:has-text("Fruit") [aria-label="Apple (Fruit)"]')
  ).toBeVisible();

  await page.locator('section:has-text("Fruit") [aria-label="Apple (Fruit)"]').click();
  await expect(
    page.locator('section:has-text("Main List") [aria-label="Apple (Fruit)"]')
  ).toBeVisible();
  await expect(page.locator('section:has-text("Fruit") [aria-label="Apple (Fruit)"]')).toHaveCount(
    0
  );

  await page.clock.runFor(5000);

  // Should still only be a single Apple button (no duplicate from an orphan timer)
  await expect(getAppleButton(page)).toHaveCount(1);
});
