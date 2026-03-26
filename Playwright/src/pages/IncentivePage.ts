import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import data from "../Data/PatientName.json";

export default class IncentivePage {
    readonly page: Page;
    public incentive: {
        incentiveLink: Locator;
        settingsTab: Locator;
        searchBar: Locator;
        editTDSButton: Locator;
        editTDSModal: Locator;
        tdsInputField: Locator;
        updateTDSButton: Locator;
        tdsValueInTable: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        this.incentive = {
            incentiveLink: page.locator(`a[href="#/Incentive"]`),
            settingsTab: page.locator('ul[class="page-breadcrumb"] a[href="#/Incentive/Setting"]'),
            searchBar: page.locator(`input#quickFilterInput`),
            editTDSButton: page.locator(`a[danphe-grid-action="edit-tds"]`),
            editTDSModal: page.locator('div.modal[title="Edit TDS Percent"]'),
            tdsInputField: page.locator('input[type="number"]'),
            updateTDSButton: page.locator('button#btn_GroupDistribution'),
            tdsValueInTable: page.locator(`div[col-id="TDSPercent"]`),
        };
    }

    /**
     * @Test9
     * @description This method updates the TDS% for a specific employee and verifies the updated value in the table.
     * @expected
     * The updated TDS% value is displayed correctly in the corresponding row of the table.
     */

    async editTDSForEmployee() {
        const patientName = data.PatientNames[2].Patient3 || "";
        const updatedTDS = Math.floor(Math.random() * 99);

        await this.incentive.incentiveLink.click();

        // Step 2: Click on the "Settings" tab
        await this.incentive.settingsTab.click();

        await this.incentive.searchBar.type(patientName, { delay: 100 });

        // Step 3: Locate the employee row and click "Edit TDS%"
        await this.incentive.editTDSButton.click();

        // Step 5: Update the TDS% value
        await this.incentive.tdsInputField.fill(String(updatedTDS));

        // Step 6: Click on "Update TDS" button
        await this.incentive.updateTDSButton.click();

        await this.incentive.searchBar.clear();
        await this.incentive.searchBar.type(patientName, { delay: 100 });
        await this.page.waitForTimeout(2000);

        // Step 8: Verify the updated TDS% value in the table
        const displayedTDS = await this.incentive.tdsValueInTable.nth(1).textContent();
        expect(displayedTDS?.trim()).toBe(String(updatedTDS));
    }

}