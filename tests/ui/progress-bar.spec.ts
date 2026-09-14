import { test } from '@playwright/test';
import { ProgressBarPage } from '../../pages/progress-bar.page';

test.describe('Progress Bar', () => {
  test('deve interromper o progresso, concluir e resetar', async ({ page }) => {
    test.setTimeout(60_000);

    const progressBarPage = new ProgressBarPage(page);

    await progressBarPage.visit();

    await progressBarPage.start();

    await progressBarPage.stopBefore25Percent();

    await progressBarPage.validateStoppedBefore25Percent();

    await progressBarPage.resumeAndWaitUntilComplete();

    await progressBarPage.reset();
  });
});