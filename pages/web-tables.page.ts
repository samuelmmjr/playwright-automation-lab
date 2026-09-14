import { expect, Page } from '@playwright/test';

export interface WebTableRecord {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  salary: number;
  department: string;
}

export class WebTablesPage {
  constructor(private readonly page: Page) {}

  async visit() {
    await this.page.goto('/webtables');

    await this.disableDemoQaInterference();

    await expect(
      this.page.locator('#addNewRecordButton'),
    ).toBeVisible();
  }

  private async disableDemoQaInterference() {
    await this.page.addStyleTag({
      content: `
        #fixedban,
        #RightSide_Advertisement,
        [id^="Ad.Plus-"],
        [id^="google_ads_"],
        iframe[title="3rd party ad content"],
        iframe[aria-label="Advertisement"] {
          pointer-events: none !important;
        }

        .col-12.mt-4.col-md-3.col-xl-3 {
          pointer-events: none !important;
        }
      `,
    });
  }

  private getRowByEmail(email: string) {
    return this.page.locator('table tbody tr', {
      hasText: email,
    });
  }

  async addRecord(record: WebTableRecord) {
    await this.page.locator('#addNewRecordButton').click();

    const modal = this.page.locator('.modal-content');

    await expect(modal).toBeVisible();

    await this.page.locator('#firstName').fill(record.firstName);
    await this.page.locator('#lastName').fill(record.lastName);
    await this.page.locator('#userEmail').fill(record.email);
    await this.page.locator('#age').fill(String(record.age));
    await this.page.locator('#salary').fill(String(record.salary));
    await this.page.locator('#department').fill(record.department);

    await this.page.locator('#submit').click();

    await expect(modal).toBeHidden();

    const row = this.getRowByEmail(record.email);

    await expect(row).toBeVisible();
    await expect(row).toContainText(record.department);
  }

  async editDepartment(email: string, department: string) {
    const row = this.getRowByEmail(email);

    await expect(row).toBeVisible();

    const editButton = row.locator('[title="Edit"]');

    await expect(editButton).toBeVisible();
    await expect(editButton).toBeEnabled();

    await editButton.scrollIntoViewIfNeeded();
    await editButton.click();

    const modal = this.page.locator('.modal-content');

    await expect(modal).toBeVisible();

    await this.page.locator('#department').fill(department);
    await this.page.locator('#submit').click();

    await expect(modal).toBeHidden();

    await expect(
      this.getRowByEmail(email),
    ).toContainText(department);
  }

  async deleteRecord(email: string) {
    const row = this.getRowByEmail(email);

    await expect(row).toBeVisible();

    const deleteButton = row.locator('[title="Delete"]');

    await expect(deleteButton).toBeVisible();
    await expect(deleteButton).toBeEnabled();

    await deleteButton.scrollIntoViewIfNeeded();
    await deleteButton.click();

    await expect(
      this.getRowByEmail(email),
    ).toHaveCount(0);
  }
}