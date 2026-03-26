import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class UtilitiesPage {
  readonly page: Page;
  public utilities: {
    utilitiesLink: Locator;
    schemeRefundTab: Locator;
    counterItem: Locator;
    newSchemenRefundEntryButton: Locator;
    saveSchemeRefundButton: Locator;
    warningPopup: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.utilities = {
      utilitiesLink: page.locator("//span[text()='Utilities']"),
      schemeRefundTab: page.locator('ul.page-breadcrumb a[href="#/Utilities/SchemeRefund"]'),
      counterItem: page.locator("//div[@class='counter-item']"),
      newSchemenRefundEntryButton: page.locator(`//a[contains(text(),"New Scheme Refund Entry")]`),
      saveSchemeRefundButton: page.locator(`button#savebutton`),
      warningPopup: page.locator(`//p[contains(text(),"warning")]/../p[contains(text(),"Please fill all the mandatory fields.")]`),
    };
  }

  /**
 * @Test6
 * @description This method verifies that a warning popup is displayed when attempting to save a new 
 *              Scheme Refund Entry without filling in mandatory fields.
 * @expected
 * A warning popup should appear with the message: "Please fill all the mandatory fields."
 */
  async verifyMandatoryFieldsWarning() {
    // Navigate to Utilities and open Scheme Refund tab
    await this.utilities.utilitiesLink.click();
    await this.utilities.schemeRefundTab.click();

    // Select first counter item if available
    await this.page.waitForTimeout(3000);
    const counterCount = await this.utilities.counterItem.count();
    console.log("counter count is " + counterCount);
    if (counterCount > 0) {
      await CommonMethods.highlightElement(
        this.utilities.counterItem.first()
      );
      await this.utilities.counterItem.first().click();
    } else {
      console.log("No counter items available");
    }

    // Click "New Scheme Refund Entry" button
    await this.utilities.newSchemenRefundEntryButton.click();

    // Click Save without filling any fields
    await this.utilities.saveSchemeRefundButton.click();

    // Wait for warning popup
    const warningPopup = this.utilities.warningPopup;
    await warningPopup.waitFor({ state: "visible" });

    // Verify warning message
    const popupMessage = await warningPopup.textContent();
    console.log(`popup >> ${popupMessage}`);
    expect(popupMessage?.trim()).toBe("Please fill all the mandatory fields.");
  }
}
