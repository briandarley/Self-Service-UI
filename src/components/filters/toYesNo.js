import Vue from "vue"


export default function toYesNo(value) {
  if (value === undefined || value === null) return "";
  if (value === true) return "Yes";
  if (typeof value == "string") {
    if (value.toUpperCase() == "TRUE") return "Yes";
    if (value.toUpperCase() == "YES") return "Yes";
    if (value.toUpperCase() == "1") return "Yes";
  }

  return "No";
}


Vue.filter("toYesNo", toYesNo);