import Vue from "vue";

export default function formatSendingCriteria(value, abreviated) {
  
  if(value == null) return "";
  let all = value.includes("ALL");
  if (all) {
    value = value.substring(4);
  }

  let items = value.toLowerCase().split(",");

  for (let i = 0; i < items.length; i++) {
    items[i] = items[i][0].toUpperCase() + items[i].slice(1);
    if (abreviated) {
      switch (items[i]) {
        case "Students":
          items[i] = "Stud";
          break;
        case "Employees":
          items[i] = "Emp";
          break;
        case "Affiliates":
          items[i] = "Aff";
          break;
        case "Faculty":
          items[i] = "Fac";
          break;
      }
    }
  }
  value = items.join(",");
  return value;
}

Vue.filter("formatSendingCriteria", formatSendingCriteria);
