import { expect, Page } from '@playwright/test';

export class BrowserWindowsPage {
  constructor(private readonly page: Page) {}

  async visit() {
    await this.page.goto('/browser-windows');

    await expect(this.page.locator('#tabButton')).toBeVisible({
      timeout: 15_000,
    });
  }

  async openNewTabAndValidate() {
    const newTabButton = this.page.locator('#tabButton');

    await expect(newTabButton).toBeVisible();
    await expect(newTabButton).toBeEnabled();

    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', {
        timeout: 15_000,
      }),
      newTabButton.click(),
    ]);

    await popup.waitForLoadState('domcontentloaded');

    const heading = popup.locator('#sampleHeading');

    await expect(heading).toBeVisible({
      timeout: 15_000,
    });

    await expect(heading).toHaveText('This is a sample page');

    await popup.close();
  }
}