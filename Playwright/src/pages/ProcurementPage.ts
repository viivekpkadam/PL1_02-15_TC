import { Locator, Page } from "playwright";
import { expect } from "playwright/test";

export default class ProcurementPage {
  readonly page: Page;
  public procurement: {
    procurementLink: Locator;
    settings: Locator;
    currencySubTab: Locator;
    addCurrencyButton1: Locator;
    addCurrencyButton2: Locator;
    currencyCode: Locator;
    currencyDescriptionField: Locator;
    searchBar: Locator;
    currecnyCodeColum: Locator;
  }

  constructor(page: Page) {
    this.page = page;
    this.procurement = {
      procurementLink: page.locator('a[href="#/ProcurementMain"]'),
      settings: page.locator(`//a[contains(text(),"Settings")]`),
      currencySubTab: page.locator(`a[routerlink="CurrencyList"]`),
      addCurrencyButton1: page.locator(`input[value="Add Currency"]`),
      addCurrencyButton2: page.locator(`input#AddCurrency`),
      currencyCode: page.locator(`input#CurrencyCode`),
      currencyDescriptionField: page.locator(`input#Description`),
      searchBar: page.locator(`input#quickFilterInput`),
      currecnyCodeColum: page.locator(`div[col-id="CurrencyCode"]`),
    }
  }

  /**
 * @Test5
 * @description This method navigates to the Purchase Request page, accesses the Currency Settings, 
 *              adds a new currency with a unique code and description, and verifies that the new 
 *              currency is successfully added to the table.
 *
 * @expected
 * The new currency should be added successfully and displayed in the table with the correct currency 
 * code and description.
 */

  async addCurrencyAndVerify() {
    const uniqueCurrencyCode = `CURR_${Math.floor(Math.random() * 9999)}`; // Generate a unique currency code
    const description = "Test Currency Description";

    // Navigate to the Currency Settings
    await this.procurement.procurementLink.click();
    await this.procurement.settings.click();
    await this.procurement.currencySubTab.click();

    // Click "Add Currency" button
    await this.procurement.addCurrencyButton1.click();

    // Fill in currency details
    await this.procurement.currencyCode.fill(uniqueCurrencyCode);
    await this.procurement.currencyDescriptionField.fill(description);

    // Click "Add Currency"
    await this.procurement.addCurrencyButton2.click();

    // Wait for table to load
    await this.page.waitForTimeout(2000);

    await this.procurement.searchBar.type(uniqueCurrencyCode, { delay: 100 });
    await this.page.waitForTimeout(2000);

    // Verify newly added currency is in the table
    const currencyRows = this.procurement.currecnyCodeColum;
    expect(await currencyRows.nth(1).textContent()).toEqual(uniqueCurrencyCode);
  }


}
