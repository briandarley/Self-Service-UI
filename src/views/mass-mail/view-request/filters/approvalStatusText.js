import Vue from "vue"
import injector from "vue-inject";


export default function approvalStatusText(entity) {
  
  let moment = injector.get("moment");

  if (!entity.campaignStatus) return `<div class="text-danger">Invalid State</div>`;
  if (entity.campaignStatus.canceledDate) return `<div class="text-danger">Request Canceled</div>`;
  if (entity.campaignStatus.deniedDate) return `<div class="text-danger">Request Denied</div>`;
  if (entity.campaignStatus.approvedDate) return `<div class="text-success">Request Approved</div>`;
  if (entity.campaignStatus.approvedDate) return `<div class="text-success">Request Approved</div>`;

  

  const dt = new Date(entity.expirationDate);

  if (moment().startOf('day').isAfter(dt)) {
    if(entity.campaignStatus.archivedDate) return `<div class="text-danger">Expired/Archived</div>`
    return `<div class="text-danger">Expired</div>`;
  }

  if(entity.campaignStatus.archivedDate) return `<div class="text-danger">Archived</div>`
  

  if(entity.targetEmployee === "DDD"){
    return `
    <div>
      Pending for Employees (DDD)
    </div>
  `;
  }
  switch (entity.targetPopulation) {
  
    case "STUDENTS":
      return `
        <div>
          Pending for Students
        </div>
      `;
    case "EMPLOYEES":
      return `
        <div>
          Pending for Employees
        </div>
      `;
    case "EMPLOYEES_STUDENTS":
      return `
        <div>
          Pending for Students and Employees
        </div>
        `;
  }
  

}


Vue.filter("approvalStatusText", approvalStatusText);