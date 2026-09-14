import { test } from '@playwright/test';
import {
  PracticeFormData,
  PracticeFormPage,
} from '../../pages/practice-form.page';

test.describe('Practice Form', () => {
  test('deve preencher e enviar o formulário com sucesso', async ({ page }) => {
    const practiceFormPage = new PracticeFormPage(page);

    const formData: PracticeFormData = {
      firstName: 'Samuel',
      lastName: 'Melo',
      email: `samuel.${Date.now()}@mail.com`,
      gender: 'Male',
      mobile: '8199999999',
      dateOfBirth: {
        day: '15',
        month: 'May',
        year: '1998',
      },
      subject: 'Maths',
      hobby: 'Reading',
      address: 'Recife - Pernambuco',
      state: 'NCR',
      city: 'Delhi',
    };

    await practiceFormPage.visit();
    await practiceFormPage.fillForm(formData);
    await practiceFormPage.submit();
    await practiceFormPage.validateSubmission(formData);
  });
});