import Vue from "vue"


export default function toEnabledDisabled(value) {
  if (value === undefined || value === null) return "";
  if (value === true) return "Enabled";
  if (typeof value == "string") {
    if (value.toUpperCase() == "TRUE") return "Enabled";
    if (value.toUpperCase() == "YES") return "Enabled";
    if (value.toUpperCase() == "1") return "Enabled";
  }

  return "Disabled";
}


Vue.filter("toEnabledDisabled", toEnabledDisabled);