import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://njmtech.vercel.app/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Nhlanhla Juniior Malaza/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://njmtech.vercel.app/');

  // Click the get started link.
  await page.getByRole('link', { name: 'link' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
