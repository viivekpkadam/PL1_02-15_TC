import { expect, test, Page } from "playwright/test";
import AppointmentPage from "../../pages/AppointmentPage";
import UtilitiesPage from "../../pages/UtilitiesPage";
import { LoginPage } from "../../pages/LoginPage";
import ProcurementPage from "../../pages/ProcurementPage";
import PatientPage from "../../pages/PatientPage";
import ADTPage from "../../pages/ADTPage";
import { SettingsPage } from "src/pages/SettingsPage";
import OperationTheatrePage from "src/pages/OperationTheatrePage";
import DoctorPage from "src/pages/DoctorPage";
import AdminPage from "src/pages/AdminPage";
import IncentivePage from "src/pages/IncentivePage";
import { SubstorePage } from "src/pages/SubstorePage";

test.describe("Yaksha", () => {
  let appointmentPage: AppointmentPage;
  let operationTheatrePage: OperationTheatrePage;
  let doctorsPage: DoctorPage;
  let utilitiesPage: UtilitiesPage;
  let adminPage: AdminPage;
  let incentivePage: IncentivePage;
  let substorePage: SubstorePage;
  let procurementPage: ProcurementPage;
  let loginPage: LoginPage;
  let patientPage: PatientPage;
  let adtPage: ADTPage;
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL as string);

    // Initialize page objects
    loginPage = new LoginPage(page);
    utilitiesPage = new UtilitiesPage(page);
    appointmentPage = new AppointmentPage(page);
    operationTheatrePage = new OperationTheatrePage(page);
    adminPage = new AdminPage(page);
    incentivePage = new IncentivePage(page);
    substorePage = new SubstorePage(page);
    doctorsPage = new DoctorPage(page);
    procurementPage = new ProcurementPage(page);
    patientPage = new PatientPage(page);
    adtPage = new ADTPage(page);
    settingsPage = new SettingsPage(page);


    // Login before each test
    await loginPage.performLogin();

    // Verify login was successful
    await verifyUserIsLoggedin(page);
  });

  // Individual test cases
  test("TS-1 Verify 'Visit Type' Appointment Dropdown Functionality", async ({ page }) => {
    await appointmentPage.verifyVisitTypeDropdown();
    await verifyVisitType(page);
  });

  test("TS-2 Handle Alert for OT Booking Without Patient Selection", async ({ page }) => {
    await operationTheatrePage.handleOtBookingAlert();
    await otBookingModalIsDisplayed(page)
  });

  test("TS-3 Verify Patient Overview Page Displayed Correctly", async ({ page }) => {
    await doctorsPage.verifyPatientOverview();
    await verifyUserIsOnCorrectURL(page, "Doctors/PatientOverviewMain/PatientOverview");
  });

  test("TS-4 Add Progress Note for In Patient", async ({ page }) => {
    await doctorsPage.addProgressNoteForPatient();
    await verifyUserIsOnCorrectURL(page, "Doctors/PatientOverviewMain/NotesSummary/FreeNotes");
  });

  test("TS-5 Add and Verify New Currency in Settings", async ({ page }) => {
    await procurementPage.addCurrencyAndVerify();
    await verifyUserIsOnCorrectURL(page, "ProcurementMain/Settings/CurrencyList");
  });

  test("TS-6 Verify Warning Popup for Mandatory Fields in Scheme Refund", async ({ page }) => {
    await utilitiesPage.verifyMandatoryFieldsWarning();
    await verifyUserIsOnCorrectURL(page, "/Utilities/SchemeRefund");
  });

  test("TS-7 Verify Navigation to User Profile Page", async ({ page }) => {
    await adminPage.verifyUserProfileNavigation();
    await verifyUserIsOnCorrectURL(page, "Employee/ProfileMain/UserProfile");
  });

  test("TS-8 Verify Patient Profile Picture Upload", async ({ page }) => {
    await patientPage.uploadProfilePicture();
    await verifyImageisUploaded(page);
  });

  test('TS-9 Verify TDS Percent update for an employee', async ({ page }) => {
    await incentivePage.editTDSForEmployee();
  });

  test("TS-10 Verify Price Category Enable/Disable", async ({ page }) => {
    await settingsPage.togglePriceCategoryStatus();
    await verifyUserIsOnCorrectURL(page, "Settings/PriceCategory");
  });

  test("TS-11 Verify Navigation Between Different Tabs", async ({ page }) => {
    await substorePage.verifyNavigationBetweenSubmodules();
    await verifyUserIsOnCorrectURL(page, "Inventory/Return");
  });

  test("TS-12 Verify tooltip text on hover in Inventory tab", async ({ page }) => {
    await substorePage.verifyTooltipText();
    await isTooltipDisplayed(page);
  });

  test("TS-13 Capture screenshot of Inventory Requisition section", async ({ page }) => {
    await substorePage.captureInventoryRequisitionScreenshot();
  });

  test('TS-14 Verify field-level error message appears when updating doctor without selection', async ({ page }) => {
    await adtPage.verifyFieldLevelErrorMessage();
    await verifyErrorMessage(page);
  });

  test("TS-15 Verify logout functionality from Admin dropdown", async ({ page }) => {
    await loginPage.verifyLogoutFunctionality();
    await verifyUserisLoggedOut(page);
  });
});


/**
 * ------------------------------------------------------Helper Methods----------------------------------------------------
 */

async function verifyUserIsLoggedin(page: Page) {
  // Verify successful login by checking if 'admin' element is visible
  await page
    .locator('//li[@class="dropdown dropdown-user"]')
    .waitFor({ state: "visible", timeout: 20000 });
  expect(
    await page.locator('//li[@class="dropdown dropdown-user"]').isVisible()
  );
}

async function verifyUserisLoggedOut(page: Page) {
  expect(await page.locator(`#login`).isVisible());
}

async function verifyVisitType(page: Page) {
  const tableLength = (await page.$$(`div[col-id="AppointmentType"]`)).length;
  expect(tableLength).toBeGreaterThan(1);
}

async function verifyUserIsOnCorrectURL(page: Page, expectedURL: string) {
  const getActualURl = page.url();
  expect(getActualURl).toContain(expectedURL);
}

async function verifyImageisUploaded(page: Page) {
  const isImgUploaded = await page.locator(`div.wrapper img`).isVisible();
  expect(isImgUploaded).toBeTruthy();
}

async function isTooltipDisplayed(page: Page) {
  expect(await page.locator("div.modal-content").isVisible()).toBeTruthy();
}

async function verifyErrorMessage(page: Page) {
  expect(await page.locator(`//span[text()='Select doctor from the list.']`).isVisible()).toBeTruthy();
}

async function otBookingModalIsDisplayed(page: Page) {
  expect(await page.locator(`div.modelbox-div`).isVisible()).toBeTruthy();
}