import { test } from '@playwright/test';
import {
  WebTableRecord,
  WebTablesPage,
} from '../../pages/web-tables.page';

test.describe('Web Tables', () => {
  test('deve criar, editar e excluir um registro', async ({ page }) => {
    const webTablesPage = new WebTablesPage(page);

    const record: WebTableRecord = {
      firstName: 'Samuel',
      lastName: 'Melo',
      email: `samuel.${Date.now()}@mail.com`,
      age: 30,
      salary: 5000,
      department: 'QA',
    };

    await webTablesPage.visit();

    await webTablesPage.addRecord(record);

    await webTablesPage.editDepartment(
      record.email,
      'Quality Assurance',
    );

    await webTablesPage.deleteRecord(record.email);
  });
});