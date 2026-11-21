import { test, expect } from '@playwright/test';

async function closeBackdropIfOpen(page: import('@playwright/test').Page) {
  const backdrop = page.locator('.sidebar-backdrop');
  for (let i = 0; i < 3; i++) {
    const visible = await backdrop.isVisible().catch(() => false);
    if (!visible) return;
    await backdrop.evaluate((el) => (el as HTMLElement).click());
    await page.waitForTimeout(100);
  }
}

test('tool loads with BPM title', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toContain('BPM');
});

test('tapping computes BPM and reset clears it', async ({ page }) => {
  await page.goto('/');
  await closeBackdropIfOpen(page);

  const tapButton = page.getByRole('button', { name: /Tap/i }).first();
  await tapButton.click();
  await page.waitForTimeout(300);
  await tapButton.click();
  await page.waitForTimeout(300);
  await tapButton.click();

  await expect(page.getByTestId('bpm-display')).not.toHaveText('—');
  await expect(page.getByTestId('tap-count')).toContainText('3 taps');

  await page.getByTestId('btn-reset').click();
  await expect(page.getByTestId('bpm-display')).toHaveText('—');
  await expect(page.getByTestId('tap-count')).toContainText('0 taps');
});
