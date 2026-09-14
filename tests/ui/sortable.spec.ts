import { test } from '@playwright/test';
import { SortablePage } from '../../pages/sortable.page';

test.describe('Sortable', () => {
  test('deve exibir os itens na ordem padrão esperada', async ({ page }) => {
    const sortablePage = new SortablePage(page);

    await sortablePage.visit();
    await sortablePage.validateDefaultListOrder();
  });
});