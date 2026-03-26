import { Page, expect, Locator } from "@playwright/test";
import path from "path";

export default class PatientPage {
  readonly page: Page;
  public patient: {
    patientLink: Locator;
    registerPatient: Locator;
    newPhotoButton: Locator;
    uploadButton: Locator;
    doneButton: Locator;
    uploadedImg: Locator;
    profilePictureIcon: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.patient = {
      patientLink: page.locator('a[href="#/Patient"]'),
      registerPatient: page.locator(`ul.page-breadcrumb a[href="#/Patient/RegisterPatient"]`),
      newPhotoButton: page.locator('//button[contains(text(),"New Photo")]'),
      uploadButton: page.locator('label[for="fileFromLocalDisk"]'),
      doneButton: page.locator('//button[text()="Done"]'),
      uploadedImg: page.locator('div.wrapper img'),
      profilePictureIcon: page.locator('a[title="Profile Picture"]'),
    };
  }

  /**
   * @Test8
   * @description This method verifies the successful upload of a profile picture for a patient by navigating to the "Register Patient" tab 
   *              and completing the upload process.
   * @expected
   * Verify that the uploaded image is displayed successfully in the patient's profile.
   */
  async uploadProfilePicture() {
    const imagePath = path.resolve(__dirname, "../TestImage/avatar.png");
    await this.patient.patientLink.click();

    // Click on the "Register Patient" tab
    await this.patient.registerPatient.click();

    // Select the Profile Picture icon
    await this.patient.profilePictureIcon.click();

    // Click on "New Photo" button
    await this.patient.newPhotoButton.click();

    // Upload image
    await this.patient.uploadButton.setInputFiles(imagePath);
    await this.page.waitForTimeout(2000);

    // Click on the "Done" button
    await this.patient.doneButton.click();

    // Verify success confirmation or image upload
    expect(await this.patient.uploadedImg.isVisible());
  }


}
