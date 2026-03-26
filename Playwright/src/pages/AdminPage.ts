import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { CommonMethods } from "src/tests/commonMethods";

export default class AdminPage {
    readonly page: Page;
    public admin: {
        adminDropdown: Locator;
        myProfileOption: Locator;
        userProfileHeader: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        this.admin = {
            adminDropdown: page.locator('//li[@class="dropdown dropdown-user"]'),
            myProfileOption: page.locator('a[routerlink="Employee/ProfileMain"]'),
            userProfileHeader: page.locator('a[routerlink="UserProfile"]'),
        };
    }

    /**
     * @Test7
     * @description This method verifies that the user is successfully navigated to the "User Profile" page 
     *              after selecting the "My Profile" option from the Admin dropdown.
     * @expected
     * Verify that the user is redirected to the "User Profile" page and the page header or title confirms this.
     */

    async verifyUserProfileNavigation() {
        // Click on Admin dropdown
        await this.admin.adminDropdown.waitFor({ state: "visible", timeout: 20000 });
        await this.page.waitForTimeout(10000);
        await CommonMethods.highlightElement(this.admin.adminDropdown);
        await this.admin.adminDropdown.click();

        // Select "My Profile" option
        await this.admin.myProfileOption.click();

        // Wait for User Profile page to load
        await this.admin.userProfileHeader.waitFor({ state: "visible" });

        // Verify that the User Profile page is displayed
        const headerText = await this.admin.userProfileHeader.textContent();
        expect(headerText?.trim()).toBe("User Profile"); // Update with the actual header text
    }
}
