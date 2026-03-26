import { Page, expect, Locator } from "@playwright/test";

export default class OperationTheatrePage {
    readonly page: Page;
    public otBooking: {
        operationTheatreLink: Locator;
        newOtBookingButton: Locator;
        addNewOtButton: Locator;
        modalHeading: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        this.otBooking = {
            operationTheatreLink: page.locator(`a[href="#/OperationTheatre"]`),
            newOtBookingButton: page.locator(`//button[contains(text(),"New OT Booking")]`),
            addNewOtButton: page.locator(`input[value="Add New OT"]`),
            modalHeading: page.locator(`div.modelbox-div`),
        };
    }

    /**
     * @Test2
     * @description This method verifies and handles the alert for OT booking without patient selection.
     */
    async handleOtBookingAlert() {
        await this.otBooking.operationTheatreLink.click();

        // Click on the "New OT Booking" button
        await this.otBooking.newOtBookingButton.click();

        // Verify the modal is displayed
        expect(await this.otBooking.modalHeading.isVisible()).toBeTruthy();

        // Click on the "Add New OT" button
        await this.otBooking.addNewOtButton.click();

        // Wait for and handle the alert
        const alertMessage = this.page.on("dialog", async (dialog) => {
            console.log("dialog >> " + dialog.message());
            expect(dialog.message()).toContain("Patient not Selected! Please Select the patient first!");
            await dialog.accept();
        });
    }


}
