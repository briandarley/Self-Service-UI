import Vue from "vue"


export default function toEmail(value) {
  if (value === undefined || value === null) return [];
  let list = value.filter(c=> c.startsWith("smtp:")).map(c=> c.substring(5))
  return  list;
}


Vue.filter("toEmail", toEmail);
