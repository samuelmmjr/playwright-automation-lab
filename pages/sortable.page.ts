import { expect, Page } from '@playwright/test';

export class SortablePage {
  constructor(private readonly page: Page) {}

  async visit() {
    await this.page.goto('/sortable');
  }

  async validateDefaultListOrder() {
    const expectedOrder = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];

    const listTab = this.page.locator('#demo-tab-list');
    const items = this.page.locator(
      '#demo-tabpane-list .vertical-list-container .list-group-item',
    );

    await expect(listTab).toHaveClass(/active/);
    await expect(items).toHaveCount(expectedOrder.length);

    const currentOrder = await items.allTextContents();

    expect(currentOrder.map((item) => item.trim())).toEqual(expectedOrder);
  }
}