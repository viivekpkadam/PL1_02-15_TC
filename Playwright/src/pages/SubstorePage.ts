import { expect, Locator, Page } from "@playwright/test";
import path from "path";

export class SubstorePage {
    readonly page: Page;
    public substore: {
        substoreLink: Locator;
        selectSubstore: Locator;
        inventoryRequisition: Locator;
        consumption: Locator;
        reports: Locator;
        patientConsumption: Locator;
        return: Locator;
        inventory: Locator;
        signoutCursor: Locator;
        tooltip: Locator;
    }

    constructor(page: Page) {
        this.page = page;
        this.substore = {
            substoreLink: page.locator('a[href="#/WardSupply"]'),
            selectSubstore: page.locator('(//span[@class="report-name"])[1]'),
            inventoryRequisition: page.locator('a[href="#/WardSupply/Inventory/InventoryRequisitionList"]'),
            consumption: page.locator('a[href="#/WardSupply/Inventory/Consumption"]'),
            reports: page.locator('a[href="#/WardSupply/Inventory/Reports"]'),
            patientConsumption: page.locator('a[href="#/WardSupply/Inventory/PatientConsumption"]'),
            return: page.locator('a[href="#/WardSupply/Inventory/Return"]'),
            inventory: page.locator(`ul.page-breadcrumb a[href="#/WardSupply/Inventory"]`),
            signoutCursor: page.locator(`i.fa-sign-out`),
            tooltip: page.locator(`div.modal-content h6`),
        }
    }

    /**
     * @Test11
     * @description : This method verifies that the user is able to navigate between the sub modules.
     * @expected : Ensure that it should navigate to each sections of the "substore" module 
     */
    async verifyNavigationBetweenSubmodules() {
        await this.substore.substoreLink.click();

        await this.substore.selectSubstore.click();

        await this.substore.inventoryRequisition.click();
        expect(this.page.url()).toContain("Inventory/InventoryRequisitionList");

        await this.substore.consumption.click();
        expect(this.page.url()).toContain("Inventory/Consumption/ConsumptionList");

        await this.substore.reports.click();
        expect(this.page.url()).toContain("Inventory/Reports");

        await this.substore.patientConsumption.click();
        expect(this.page.url()).toContain("Inventory/PatientConsumption/PatientConsumptionList");

        await this.substore.return.click();
        expect(this.page.url()).toContain("Inventory/Return");
    }

    /**
    * @Test12
    * @description This method verifies the tooltip text displayed when hovering over the cursor icon in the Inventory tab.
    * @expected
    * Tooltip text should contain: **"To change, you can always click here."**
    */
    async verifyTooltipText() {
        await this.substore.substoreLink.click();

        await this.substore.selectSubstore.click();

        // Click on the Inventory tab
        await this.substore.inventory.click();

        // Hover over the cursor icon
        await this.substore.signoutCursor.hover();

        // Verify the tooltip text
        const tooltipText = await this.substore.tooltip.textContent();
        expect(tooltipText?.trim()).toContain("To change, you can always click here.");
    }

    /**
     * @Test13
     * @description This method navigates to the Inventory Requisition section, captures a screenshot of the page, 
     *              and saves it in the screenshots folder.
     * @expected
     * Screenshot of the page is captured and saved successfully.
     */
    async captureInventoryRequisitionScreenshot() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const screenshotPath = path.join(__dirname, `../screenshots/inventory-requisition-${timestamp}.png`);

        await this.substore.substoreLink.click();

        await this.substore.selectSubstore.click();

        await this.substore.inventory.click();

        // Click on the Inventory Requisition section
        await this.substore.inventoryRequisition.click();
        expect(this.page.url()).toContain("Inventory/InventoryRequisitionList");

        // Take a screenshot of the current page
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
    }



}