import { Page, expect, Locator } from "@playwright/test";

export default class AppointmentPage {
  readonly page: Page;
  public appointment: {
    appointmentLink: Locator;
    counterItem: Locator;
    appointmentBookingList: Locator;
    visitTypeDropdown: Locator;
    fromDate: Locator;
    showPatient: Locator;
    visitTypeColumn: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.appointment = {
      appointmentLink: page.locator('a[href="#/Appointment"]'),
      counterItem: page.locator("//div[@class='counter-item']"),
      appointmentBookingList: page.locator(`ul.page-breadcrumb li a[href="#/Appointment/ListAppointment"]`),
      visitTypeDropdown: page.locator(`select[name="VistType"]`),
      fromDate: page.locator(`(//input[@id="date"])[1]`),
      showPatient: page.locator(`//button[contains(text(),"Show Patient")]`),
      visitTypeColumn: page.locator(`div[col-id="AppointmentType"]`),
    };
  }

  /**
     * @Test1
     * @description This method verifies the 'Visit Type' dropdown functionality and validates 'New Visit' patients.
     */
  async verifyVisitTypeDropdown() {

    await this.appointment.appointmentLink.click();
    console.log("link clicked ", this.appointment.appointmentLink);

    // Select first counter item if available
    await this.appointment.counterItem.first().waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
    const counterCount = await this.appointment.counterItem.count();
    console.log("counter count is " + counterCount);
    if (counterCount > 0) {
      await this.appointment.counterItem.first().click();
      await this.appointment.appointmentLink.click();
    } else {
      console.log("No counter items available");
    }

    await this.appointment.appointmentBookingList.click();

    // Select "New Patient" from the dropdown
    await this.appointment.visitTypeDropdown.selectOption({ label: "New Patient" });

    // Select "January 2024" in the FROM date field
    await this.appointment.fromDate.type("01-01-2024", { delay: 100 });

    // Click the "Show Patient" button
    await this.appointment.showPatient.click();
    await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});

    // Validate that the "Visit Type" column contains only "New Visit"
    const visitTypeCells = this.appointment.visitTypeColumn;
    const visitTypeCount = await visitTypeCells.count();
    console.log(`visit count >> ${visitTypeCount}`);

    for (let i = 1; i < visitTypeCount; i++) {
      const visitTypeText = await visitTypeCells.nth(i).textContent();
      expect(visitTypeText?.trim()).toContain("New");
    }
  }
}
