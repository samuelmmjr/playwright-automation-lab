import { expect, Page } from '@playwright/test';

export class ProgressBarPage {
  constructor(private readonly page: Page) {}

  private get progressBar() {
    return this.page.locator('#progressBar .progress-bar');
  }

  private get startStopButton() {
    return this.page.locator('#startStopButton');
  }

  private get resetButton() {
    return this.page.locator('#resetButton');
  }

  async visit() {
    await this.page.goto('/progress-bar');
  }

  async start() {
    await expect(this.startStopButton).toHaveText('Start');
    await this.startStopButton.click();
  }

  async stopBefore25Percent() {
    await expect
      .poll(
        async () => {
          const value = await this.progressBar.getAttribute('aria-valuenow');
          return Number(value);
        },
        {
          timeout: 10_000,
        },
      )
      .toBeGreaterThan(0);

    const currentValue = Number(
      await this.progressBar.getAttribute('aria-valuenow'),
    );

    expect(currentValue).toBeLessThan(25);

    await this.startStopButton.click();
  }

  async validateStoppedBefore25Percent() {
    const value = Number(
      await this.progressBar.getAttribute('aria-valuenow'),
    );

    expect(value).toBeLessThan(25);
  }

  async resumeAndWaitUntilComplete() {
    await this.startStopButton.click();

    await expect(this.progressBar).toHaveAttribute('aria-valuenow', '100', {
      timeout: 30_000,
    });

    await expect(this.progressBar).toHaveText('100%');
    await expect(this.resetButton).toBeVisible();
  }

  async reset() {
    await this.resetButton.click();

    await expect(this.startStopButton).toHaveText('Start');

    await expect(this.progressBar).toHaveAttribute(
      'aria-valuenow',
      '0',
    );

    await expect(this.progressBar).toHaveText('0%');
  }
}