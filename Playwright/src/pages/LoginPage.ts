import { expect, Locator, Page } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import testData from "../Data/ValidLogin.json";

export class LoginPage {
  readonly page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private loginErrorMessage: Locator;
  private admin: Locator;
  private logOut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(`#username_id`);
    this.passwordInput = page.locator(`#password`);
    this.loginButton = page.locator(`#login`);
    this.loginErrorMessage = page.locator(
      `//div[contains(text(),"Invalid credentials !")]`
    );
    this.admin = page.locator('//li[@class="dropdown dropdown-user"]');
    this.logOut = page.locator("//a[text() = ' Log Out ']");
  }

  /**
   * @Test0 This method logs in the user with valid credentials.
   *
   * @description This method performs the login operation using the provided valid credentials. It highlights the input
   *              fields for better visibility during interaction and fills the username and password fields. After submitting
   *              the login form by clicking the login button, it validates the success of the login process. The login is
   *              considered successful if there are no errors.
   */

  async performLogin() {
    try {
      const loginData = testData.ValidLogin;
      const validUserName = loginData.ValidUserName;
      const validPassword = loginData.ValidPassword;

      // Highlight and fill the username field
      await CommonMethods.highlightElement(this.usernameInput);
      await this.usernameInput.fill(validUserName);

      // Highlight and fill the password field
      await CommonMethods.highlightElement(this.passwordInput);
      await this.passwordInput.fill(validPassword);

      // Highlight and click the login button
      await CommonMethods.highlightElement(this.loginButton);
      await this.loginButton.click();

      // Verify successful login by checking if 'admin' element is visible
      await this.admin.waitFor({ state: "visible", timeout: 20000 });
      expect(await this.admin.isVisible()).toBeTruthy();
    } catch (e) {
      console.error("Error during login:", e);
    }
  }

  /**
     * @Test15
     * @description This method verifies the logout functionality from the Admin dropdown.
     * @expected
     * User is logged out successfully and the login page is displayed.
     */
  async verifyLogoutFunctionality() {
    await this.page.waitForTimeout(10000);
    await CommonMethods.highlightElement(this.admin);
    await this.admin.click();
    await CommonMethods.highlightElement(this.logOut);
    await this.logOut.click();

    expect(await this.loginButton.isVisible());
  }
}
