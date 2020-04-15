import Vue from "vue"
import injector from 'vue-inject';

var moment = require("moment");

export default function formatDateTime(value,format) {
  
  if(!value) return "";
  
  let commonExtensions = injector.get("CommonExtensions");
  
  if(typeof value == "number"){
    return moment(commonExtensions.toDateFromLdapTime(value)).format("MM/DD/YYYY h:mm:ss a");
  }
  if(!format)
  {
    return moment(value).format("MM/DD/YYYY h:mm:ss a");
  }
  return moment(value).format(format);
  
}


Vue.filter("formatDateTime", formatDateTime);
