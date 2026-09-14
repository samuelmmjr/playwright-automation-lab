import { expect, Page } from '@playwright/test';

export class BrowserWindowsPage {
  constructor(private readonly page: Page) {}

  async visit() {
    await this.page.goto('/browser-windows');
  }

  async openNewTabAndValidate() {
    const popupPromise = this.page.waitForEvent('popup');

    await this.page.getByRole('button', { name: 'New Tab' }).click();

    const popup = await popupPromise;

    await popup.waitForLoadState();

    await expect(popup.locator('#sampleHeading')).toBeVisible();
    await expect(popup.locator('#sampleHeading')).toHaveText('This is a sample page');
  }
}