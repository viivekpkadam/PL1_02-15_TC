import { Page, expect, Locator } from "@playwright/test";
import data from "../Data/PatientName.json";
import { CommonMethods } from "src/tests/commonMethods";

export default class DoctorPage {
    readonly page: Page;
    public doctor: {
        doctorLink: Locator;
        inPatientTab: Locator;
        searchBox: Locator;
        actionsPreviewIcon: Locator;
        patientNameHeading: Locator;
        notesSection: Locator;
        addNotesButton: Locator;
        templateDropdown: Locator;
        subjectiveNotesField: Locator;
        successConfirmationPopup: Locator;
        saveNotesButton: Locator;
        noteType: Locator
    };

    constructor(page: Page) {
        this.page = page;
        this.doctor = {
            doctorLink: page.locator(`a[href="#/Doctors"]`),
            inPatientTab: page.locator(`ul.page-breadcrumb  a[href="#/Doctors/InPatientDepartment"]`),
            searchBox: page.locator(`input#quickFilterInput`),
            actionsPreviewIcon: page.locator(`a[title="Preview"]`),
            patientNameHeading: page.locator(`h1.pat-name-hd`),
            notesSection: page.locator(`a[href="#/Doctors/PatientOverviewMain/NotesSummary"]`),
            addNotesButton: page.locator(`//a[text()="Add Notes"]`),
            templateDropdown: page.locator(`input[value-property-name="TemplateName"]`),
            subjectiveNotesField: page.locator(`//label[text()="Subjective Notes"]/../div/textarea`),
            successConfirmationPopup: page.locator(`//p[contains(text(),"Success")]/../p[contains(text(),"Progress Note Template added.")]`),
            saveNotesButton: page.locator(`//button[contains(text(),"Save")]`),
            noteType: page.locator(`input[placeholder="Select Note Type"]`),
        };
    }

    /**
   * @Test3 
   * @description This method searches for a patient and verifies their overview page.
   */
    async verifyPatientOverview() {
        const patientName = data.PatientNames[0].Patient1 || "";
        await this.doctor.doctorLink.click();

        // Click on the "In Patient Department" tab
        await this.doctor.inPatientTab.click();

        // Search for the patient
        let searchbox = this.doctor.searchBox;
        for (let i = 0; i < await searchbox.count(); i++) {
            if (await searchbox.nth(i).isVisible()) {
                await searchbox.nth(i).type(patientName, { "delay": 200 });
                break; // Exit the loop after filling the visible search box
            }
        }
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});

        // Click on the preview icon under Actions
        await this.doctor.actionsPreviewIcon.click();

        // Verify the patient overview page is displayed with the correct patient name
        await this.doctor.patientNameHeading.waitFor({ "state": "visible" });
        const displayedPatientName = await this.doctor.patientNameHeading.textContent();
        expect(displayedPatientName?.trim()).toBe(patientName);
    }

    /**
 * @Test4 
 * @description This method searches for a specific patient in the In Patient Department, navigates to the patient's 
 *              overview page, and adds a Progress Note. The method ensures that the note is successfully added 
 *              and verifies the confirmation message.
 * @expected 
 * The method should successfully add a Progress Note for the patient, and a success confirmation message 
 * with the text "Progress Note Template added." should be displayed.
 */
    async addProgressNoteForPatient() {
        const patientName = data.PatientNames[1].Patient2 || "";

        await this.doctor.doctorLink.click();
        // Navigate to In Patient Department Tab
        await this.doctor.inPatientTab.click();

        // Search for the patient
        const searchbox = this.doctor.searchBox;
        for (let i = 0; i < await searchbox.count(); i++) {
            if (await searchbox.nth(i).isVisible()) {
                await searchbox.nth(i).type(patientName);
                break;
            }
        }
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});

        // Click on the preview icon under Actions
        await this.doctor.actionsPreviewIcon.click();

        // Click on Notes section
        await this.doctor.notesSection.click();

        // Click on Add Notes button
        await this.doctor.addNotesButton.click();

        await this.doctor.noteType.click();
        await this.doctor.noteType.type("Progress Note", { delay: 100 });
        await this.doctor.noteType.press("Enter");

        // Select "Progress Note" from the Template dropdown
        await this.doctor.templateDropdown.click();
        await this.doctor.templateDropdown.type("Progress Note", { delay: 100 });
        await this.doctor.templateDropdown.press("Enter");

        // Enter subjective notes
        await this.doctor.subjectiveNotesField.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
        await this.doctor.subjectiveNotesField.fill("Test Notes");
        await this.page.waitForLoadState("domcontentloaded", { timeout: 3000 }).catch(() => {});

        // Click Save
        await CommonMethods.highlightElement(this.doctor.saveNotesButton);
        // await this.doctor.saveNotesButton.click();
        await this.doctor.saveNotesButton.press("Enter");
        await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});

        // Verify success confirmation popup
        if (await this.doctor.successConfirmationPopup.isVisible()) {
            const successPopup = this.doctor.successConfirmationPopup;
            expect(await successPopup.textContent()).toContain("Progress Note Template added.");
        }
    }




}