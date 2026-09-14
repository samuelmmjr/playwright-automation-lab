import { test } from '@playwright/test';
import { BrowserWindowsPage } from '../../pages/browser-windows.page';

test.describe('Browser Windows', () => {
  test('deve abrir nova aba e validar a página de destino', async ({ page }) => {
    const browserWindowsPage = new BrowserWindowsPage(page);

    await browserWindowsPage.visit();
    await browserWindowsPage.openNewTabAndValidate();
  });
});