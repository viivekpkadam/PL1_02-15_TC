import { Page, expect, Locator } from "@playwright/test";
import data from "../Data/PatientName.json";

export default class ADTPage {
  readonly page: Page;
  public ADT: {
    ADTLink: Locator;
    searchBar: Locator;
    admittedPatientsTab: Locator;
    moreOptionsButton: Locator;
    changeDoctorOption: Locator;
    changeDoctorModal: Locator;
    updateButton: Locator;
    fieldErrorMessage: Locator;
    counterItem: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.ADT = {
      ADTLink: page.locator('a[href="#/ADTMain"]'),
      searchBar: page.locator("#quickFilterInput"),
      admittedPatientsTab: page.locator('ul.page-breadcrumb a[href="#/ADTMain/AdmittedList"]'),
      moreOptionsButton: page.locator(`//button[contains(text(),'...')]`),
      changeDoctorOption: page.locator('a[danphe-grid-action="changedr"]'),
      changeDoctorModal: page.locator('div.modelbox-div'),
      updateButton: page.locator('//button[text()="Update"]'),
      fieldErrorMessage: page.locator(`//span[text()='Select doctor from the list.']`),
      counterItem: page.locator("//div[@class='counter-item']"),
    };
  }

  /**
   * @Test14
   * @description This test verifies that the error message "Select doctor from the list." is displayed 
   *              when the user attempts to update the doctor without selecting a value.
   * @expected The error message "Select doctor from the list." is shown near the field.
   */
  async verifyFieldLevelErrorMessage() {
    const patientName = data.PatientNames[0].Patient1 || "";

    await this.ADT.ADTLink.click();

    // Select first counter item if available
    await this.page.waitForTimeout(3000);
    const counterCount = await this.ADT.counterItem.count();
    if (counterCount > 0) {
      await this.ADT.counterItem.first().click();
    } else {
      console.log("No counter items available");
    }

    // Navigate to "Admitted Patients" tab
    await this.ADT.admittedPatientsTab.click();

    // Search for the patient
    await this.ADT.searchBar.type(patientName, { delay: 100 });
    await this.page.keyboard.press("Enter");

    // Click on the "..." button for the patient
    await this.ADT.moreOptionsButton.click();

    // Select "Change Doctor" from the options
    await this.ADT.changeDoctorOption.click();

    // Wait for the "Change Doctor" modal to appear
    await this.ADT.changeDoctorModal.waitFor({ state: "visible" });

    // Click on the "Update" button without selecting a doctor
    await this.ADT.updateButton.click();

    // Verify the error message is displayed
    const errorMessage = this.ADT.fieldErrorMessage;
    expect(await errorMessage.isVisible()).toBeTruthy();
    expect(await errorMessage.textContent()).toBe("Select doctor from the list.");
  }

}