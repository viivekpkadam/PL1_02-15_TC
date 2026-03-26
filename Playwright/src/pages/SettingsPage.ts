import { expect, Locator, Page } from "@playwright/test";

export class SettingsPage {
    readonly page: Page;
    public settings: {
        settingsLink: Locator;
        moreDropdown: Locator;
        priceCategoryTab: Locator;
        disableButton: (code: string) => Locator;
        enableButton: (code: string) => Locator;
        activateSuccessMessage: Locator;
        deactivateSuccessMessage: Locator;
    }

    constructor(page: Page) {
        this.page = page;
        this.settings = {
            settingsLink: page.locator('a[href="#/Settings"]'),
            moreDropdown: page.locator('//a[contains(text(),"More...")]'),
            priceCategoryTab: page.locator('ul.dropdown-menu a[href="#/Settings/PriceCategory"]'),
            disableButton: (code: string) =>
                page.locator(`//div[text()="${code}"]/../div/span/a[@danphe-grid-action="deactivatePriceCategorySetting"]`),
            enableButton: (code: string) =>
                page.locator(`//div[text()="${code}"]/../div/span/a[@danphe-grid-action="activatePriceCategorySetting"]`),
            activateSuccessMessage: page.locator('//p[contains(text(),"success")]/../p[text()="Activated."]'),
            deactivateSuccessMessage: page.locator('//p[contains(text(),"success")]/../p[text()="Deactivated."]'),
        }
    }

    /**
     * @Test10
     * @description This method verifies disabling and enabling a price category code in the table.
     * @expected
     * A success message is displayed for both actions: "Deactivated." for disabling and "Activated." for enabling.
     */
    async togglePriceCategoryStatus() {
        await this.settings.settingsLink.click();

        // Step 2: Open the "more..." dropdown and select the "Price Category" tab
        await this.settings.moreDropdown.click();
        await this.settings.priceCategoryTab.click();

        // Step 3: Disable the specified code
        await this.settings.disableButton("NHIF-1").click();

        // Step 4: Verify the "Deactivated." success message
        await this.settings.deactivateSuccessMessage.waitFor({ state: 'visible' });
        const deactivateMessage = await this.settings.deactivateSuccessMessage.textContent();
        expect(deactivateMessage?.trim()).toBe("Deactivated.");

        // Step 5: Enable the same code
        await this.settings.enableButton("NHIF-1").click();

        // Step 6: Verify the "Activated." success message
        await this.settings.activateSuccessMessage.waitFor({ state: 'visible' });
        const activateMessage = await this.settings.activateSuccessMessage.textContent();
        expect(activateMessage?.trim()).toBe("Activated.");
    }


}