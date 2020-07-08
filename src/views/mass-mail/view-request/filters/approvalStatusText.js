import Vue from "vue";
import injector from "vue-inject";
//Shows the current overal state of the campaign
export default function approvalStatusText(entity, codeValues) {
  let moment = injector.get("moment");
  let helper = injector.get("MassMailCodeValueHelperService");

  if (!entity.campaignStatus)
    return `<div class="text-danger">Invalid State</div>`;
  if (entity.campaignStatus.canceledDate)
    return `<div class="text-danger">Request Canceled</div>`;
  if (entity.campaignStatus.deniedDate)
    return `<div class="text-danger">Request Denied</div>`;
  if (entity.campaignStatus.status === "DONE")
    return `<div class="text-success">Campaign Delivered</div>`;
  if (entity.campaignStatus.approvedDate)
    return `<div class="text-success">Request Approved</div>`;
  if (entity.campaignStatus.approvedDate)
    return `<div class="text-success">Request Approved</div>`;

  const dt = new Date(entity.expirationDate);

  if (
    moment()
      .startOf("day")
      .isAfter(dt)
  ) {
    if (entity.campaignStatus.archivedDate)
      return `<div class="text-danger">Expired/Archived</div>`;
    return `<div class="text-danger">Expired</div>`;
  }

  if (entity.campaignStatus.archivedDate)
    return `<div class="text-danger">Archived</div>`;

  let statusText = [];

  if (entity.campaignStatus.approvedEmployeesDate) {
    statusText.push(`<div class="text-success">Approved Employees</div>`);
  }
  if (entity.campaignStatus.approvedStudentsDate) {
    statusText.push(`<div class="text-success">Approved Students</div>`);
  }
  if (entity.campaignStatus.deniedEmployeesDate) {
    statusText.push(`<div class="text-danger">Denied Employees</div>`);
  }
  if (entity.campaignStatus.deniedStudentsDate) {
    statusText.push(`<div class="text-success">Denied Students</div>`);
  }

  function hasEmployeePending() {
    return !this.deniedEmployeesDate && !this.approvedEmployeesDate;
  }

  function hasStudentPending() {
    return !this.deniedStudentsDate && !this.approvedStudentsDate;
  }
  entity.campaignStatus.hasEmployeePending = hasEmployeePending;
  entity.campaignStatus.hasStudentPending = hasStudentPending;

  if (
    !entity.campaignStatus.hasEmployeePending() &&
    !entity.campaignStatus.hasStudentPending()
  ) {
    return statusText.join("");
  }

  //let parentSelectCodes = helper.getSelectedParentCodeValues(entity.campaignAudienceSelections.includePopulations, codeValues);
  //let targetPopulationNull = !entity.campaignAudienceSelections || !entity.campaignAudienceSelections.includePopulations || !entity.campaignAudienceSelections.includePopulations.length;
  //will need to pull the population, reduce to get parents

  if (entity.targetPopulation) {
    if (entity.targetPopulation.includes("STUDENTS")) {
      if (entity.campaignStatus.hasStudentPending()) {
        statusText.push(`
      <div>
        Pending for Students
      </div>`);
      }
    }
    if (
      entity.targetPopulation.includes("EMPLOYEES") ||
      entity.targetPopulation.includes("AFFILIATES")
    ) {
      if (entity.campaignStatus.hasEmployeePending()) {
        statusText.push(`
        <div>
          Pending for Employees
        </div>
      `);
      }
    }
  }

  return statusText.join("");
}

Vue.filter("approvalStatusText", approvalStatusText);
