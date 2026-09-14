import { expect, Page } from '@playwright/test';

export interface PracticeFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  subject: string;
  hobby: 'Sports' | 'Reading' | 'Music';
  address: string;
  state: string;
  city: string;
}

export class PracticeFormPage {
  constructor(private readonly page: Page) {}

  async visit() {
    await this.page.goto('/automation-practice-form');
  }

  async fillForm(data: PracticeFormData) {
    await this.page.locator('#firstName').fill(data.firstName);
    await this.page.locator('#lastName').fill(data.lastName);
    await this.page.locator('#userEmail').fill(data.email);

    await this.page
      .getByText(data.gender, { exact: true })
      .click();

    await this.page.locator('#userNumber').fill(data.mobile);

    await this.page.locator('#dateOfBirthInput').click();

    await this.page.locator('.react-datepicker__month-select').selectOption({
      label: data.dateOfBirth.month,
    });

    await this.page.locator('.react-datepicker__year-select').selectOption(
      data.dateOfBirth.year,
    );

    await this.page
      .locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)')
      .getByText(data.dateOfBirth.day, { exact: true })
      .click();

    await this.page.locator('#subjectsInput').fill(data.subject);
    await this.page.getByText(data.subject, { exact: true }).click();

    await this.page
      .getByText(data.hobby, { exact: true })
      .click();

    await this.page.locator('#currentAddress').fill(data.address);

    await this.page.locator('#state').click();
    await this.page.getByText(data.state, { exact: true }).click();

    await this.page.locator('#city').click();
    await this.page.getByText(data.city, { exact: true }).click();
  }

  async submit() {
    await this.page.locator('#submit').click();
  }

  async validateSubmission(data: PracticeFormData) {
    const modal = this.page.locator('.modal-content');

    await expect(modal).toBeVisible();

    await expect(
      modal.getByText(`${data.firstName} ${data.lastName}`, { exact: true }),
    ).toBeVisible();

    await expect(
      modal.getByText(data.email, { exact: true }),
    ).toBeVisible();

    await expect(
      modal.getByText(data.mobile, { exact: true }),
    ).toBeVisible();

    await expect(
      modal.getByText(data.subject, { exact: true }),
    ).toBeVisible();

    await expect(
      modal.getByText(data.address, { exact: true }),
    ).toBeVisible();
  }
}