import Vue from "vue"


export default function formatSendingCriteria(value,abreviated) {
  switch (value) {
    case "STUDENTS":
      return "Students";
    case "EMPLOYEES":
      return "Employees";
    case "FACULTY":
      return "Faculty";
    case "EMPLOYEES_STUDENTS":
        if(abreviated)
        {
          return 'Employee/Student';
        }
      return "Employees and Students";
  }

}


Vue.filter("formatSendingCriteria", formatSendingCriteria);