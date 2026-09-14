import { test } from '@playwright/test';

import {
  PracticeFormData,
  PracticeFormPage,
} from '../../pages/practice-form.page';

test.describe('Practice Form', () => {
  test('deve preencher e enviar o formulário com sucesso', async ({ page }) => {
    test.setTimeout(60_000);

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

    await test.step('Acessar Practice Form', async () => {
      await practiceFormPage.visit();
    });

    await test.step('Preencher Practice Form', async () => {
      await practiceFormPage.fillForm(formData);
    });

    await test.step('Enviar Practice Form', async () => {
      await practiceFormPage.submit();
    });

    await test.step('Validar dados enviados', async () => {
      await practiceFormPage.validateSubmission(formData);
    });
  });
});