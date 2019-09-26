import Vue from "vue"

export default function formatEmployeeCriteria(value) {
  if (value) {
    return "/ " + value;
  }
  return "";
}

Vue.filter("formatEmployeeCriteria", formatEmployeeCriteria);
