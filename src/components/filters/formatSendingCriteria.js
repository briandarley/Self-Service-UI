import Vue from "vue"


export default function formatSendingCriteria(value) {
  switch (value) {
    case "STUDENTS":
      return "Students";
    case "EMPLOYEES":
      return "Employees";
    case "FACULTY":
      return "Faculty";
    case "EMPLOYEES_STUDENTS":
      return "Employees and Students";
  }

}


Vue.filter("formatSendingCriteria", formatSendingCriteria);