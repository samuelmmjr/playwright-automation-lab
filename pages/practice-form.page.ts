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

    await expect(this.page.locator('#firstName')).toBeVisible({
      timeout: 15_000,
    });
  }

  async fillForm(data: PracticeFormData) {
    await this.page.locator('#firstName').fill(data.firstName);
    await this.page.locator('#lastName').fill(data.lastName);
    await this.page.locator('#userEmail').fill(data.email);

    await this.page
      .locator(`label[for="gender-radio-${this.getGenderIndex(data.gender)}"]`)
      .click();

    await this.page.locator('#userNumber').fill(data.mobile);

    await this.fillDateOfBirth(data.dateOfBirth);

    await this.selectSubject(data.subject);

    await this.page
      .locator(
        `label[for="hobbies-checkbox-${this.getHobbyIndex(data.hobby)}"]`,
      )
      .click();

    await this.page.locator('#currentAddress').fill(data.address);

    await this.selectState(data.state);
    await this.selectCity(data.city);
  }

  async submit() {
    const submitButton = this.page.locator('#submit');

    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    await submitButton.click();
  }

  async validateSubmission(data: PracticeFormData) {
    const modal = this.page.locator('.modal-content');

    await expect(modal).toBeVisible({
      timeout: 15_000,
    });

    await expect(
      modal.getByText(`${data.firstName} ${data.lastName}`, {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      modal.getByText(data.email, {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      modal.getByText(data.mobile, {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      modal.getByText(data.subject, {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      modal.getByText(data.address, {
        exact: true,
      }),
    ).toBeVisible();
  }

  private async fillDateOfBirth(
    dateOfBirth: PracticeFormData['dateOfBirth'],
  ) {
    await this.page.locator('#dateOfBirthInput').click();

    await this.page
      .locator('.react-datepicker__month-select')
      .selectOption({
        label: dateOfBirth.month,
      });

    await this.page
      .locator('.react-datepicker__year-select')
      .selectOption(dateOfBirth.year);

    await this.page
      .locator(
        '.react-datepicker__day:not(.react-datepicker__day--outside-month)',
      )
      .filter({
        hasText: new RegExp(`^${dateOfBirth.day}$`),
      })
      .click();
  }

  private async selectSubject(subject: string) {
    const subjectInput = this.page.locator('#subjectsInput');

    await subjectInput.fill(subject);

    const option = this.page.getByRole('option', {
      name: subject,
      exact: true,
    });

    await expect(option).toBeVisible();
    await option.click();
  }

  private async selectState(state: string) {
    const stateCombobox = this.page
      .locator('#state')
      .getByRole('combobox');

    await expect(stateCombobox).toBeVisible();

    await stateCombobox.click();

    await expect(stateCombobox).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    const option = this.page.getByRole('option', {
      name: state,
      exact: true,
    });

    await expect(option).toBeVisible();
    await option.click();
  }

  private async selectCity(city: string) {
    const cityCombobox = this.page
      .locator('#city')
      .getByRole('combobox');

    await expect(cityCombobox).toBeVisible();

    await cityCombobox.click();

    await expect(cityCombobox).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    const option = this.page.getByRole('option', {
      name: city,
      exact: true,
    });

    await expect(option).toBeVisible();
    await option.click();
  }

  private getGenderIndex(gender: PracticeFormData['gender']) {
    const map: Record<PracticeFormData['gender'], number> = {
      Male: 1,
      Female: 2,
      Other: 3,
    };

    return map[gender];
  }

  private getHobbyIndex(hobby: PracticeFormData['hobby']) {
    const map: Record<PracticeFormData['hobby'], number> = {
      Sports: 1,
      Reading: 2,
      Music: 3,
    };

    return map[hobby];
  }
}